import express, {NextFunction, Request, Response, Router} from "express";
import {Collection, DB} from "@tigrisdata/core";
import {Order} from "../models/order";
import {
    SelectorFilterOperator,
    UpdateFieldsOperator
} from "@tigrisdata/core/dist/types";
import {Controller} from "./controller";
import {User} from "../models/user";
import {Product} from "../models/product";

export class OrderController implements Controller {

    private readonly db: DB;
    private readonly orders: Collection<Order>;
    private readonly router: Router;
    private readonly path: string;

    constructor(db: DB, app: express.Application) {
        this.orders = db.getCollection<Order>('orders');
        this.path = '/order';
        this.router = Router();
        this.db = db;
        this.setupRoutes(app);
    }

    public getOrder = async (req: Request, res: Response, next: NextFunction) => {
        this.orders.readOne({
            op: SelectorFilterOperator.EQ,
            fields: {
                orderId: Number.parseInt(req.params.id)
            }
        }).then(order => {
            if(order !== undefined) {
                res.status(200).json(order);
            }else {
                res.status(404).json({error: 'Order not found'});
            }
        }).catch(error => {
            next(error);
        });
    };

    public createOrder = async (req: Request, res: Response) => {
        this.db.transact(async tx => {
            // get user
            const user: (User | undefined) = await this.db.getCollection<User>('users').readOne({
                op: SelectorFilterOperator.EQ,
                fields: {
                    userId: Number.parseInt(req.params.userId)
                }
            }, tx);
            if (user === undefined) {
                res.status(404).json({error: 'User not found'});
                return;
            }

            // get product
            const product: (Product | undefined) = await this.db.getCollection<Product>('products').readOne(
                {
                    op: SelectorFilterOperator.EQ,
                    fields: {
                        productId: Number.parseInt(req.params.productId)
                    }
                },
                tx
            );
            if (product === undefined) {
                res.status(404).json({error: 'Product not found'});
                return;
            }

            // read quantity for order
            const qty: number = Number.parseInt(req.params.quantity);

            // check quantity available
            if (qty > product.quantity) {
                res.status(412).json({error: 'Insufficient product quantity'});
                return;
            }
            const orderTotal: number = qty * product.price;

            // check balance available
            if (user.balance < orderTotal) {
                res.status(412).json({error: 'Insufficient user balance'});
                return;
            }

            // deduct balance
            await this.db.getCollection<User>('users').update(
                {
                    op: SelectorFilterOperator.EQ,
                    fields: {
                        userId: user.userId
                    }
                },
                {
                    op: UpdateFieldsOperator.SET,
                    fields: {
                        balance: user.balance - orderTotal
                    }
                },
                tx
            );
            console.log('deducted user balance');

            // deduct product quantity
            await this.db.getCollection<Product>('products').update(
                {
                    op: SelectorFilterOperator.EQ,
                    fields: {
                        productId: product.productId
                    }
                },
                {
                    op: UpdateFieldsOperator.SET,
                    fields: {
                        quantity: product.quantity - qty
                    }
                },
                tx
            );
            // create order
            const order: Order = {
                orderId: 0, // server will auto-generate it,
                orderTotal: orderTotal,
                userId: user.userId,
                productItems: [
                    {
                        productId: product.productId,
                        quantity: qty
                    }
                ]
            };

            await this.orders.insert(order, tx);
            console.log('order created');

            res.status(200).json({status: 'Order placed successfully'});
        });
    };

    public deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
        this.orders.delete({
            op: SelectorFilterOperator.EQ,
            fields: {
                orderId: Number.parseInt(req.params.id)
            }
        }).then(response => {
            res.status(200).json(response);
        }).catch(error => {
            next(error);
        });
    };

    setupRoutes(app: express.Application) {
        this.router.post(`${this.path}/:userId/:productId/:quantity`, this.createOrder);
        this.router.get(`${this.path}/:id`, this.getOrder);
        this.router.delete(`${this.path}/:id`, this.deleteOrder);
        app.use('/', this.router);
    }
}
