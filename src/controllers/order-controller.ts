import express, {NextFunction, Request, Response, Router} from "express";
import {Collection, DB} from "@tigrisdata/core";
import {Order} from "../models/order";
import {Controller} from "./controller";

export class OrderController implements Controller {

    private readonly db: DB;
    private readonly orders: Collection<Order>;
    private readonly router: Router;
    private readonly path: string;

    constructor(db: DB, app: express.Application) {
        this.orders = db.getCollection<Order>('orders');
        this.path = '/orders';
        this.router = Router();
        this.db = db;
        this.setupRoutes(app);
    }

    public getOrder = async (req: Request, res: Response, next: NextFunction) => {
        this.orders.findOne({
            orderId: Number.parseInt(req.params.id)
        }).then(order => {
            if (order !== undefined) {
                res.status(200).json(order);
            } else {
                res.status(404).json({error: 'Order not found'});
            }
        }).catch(error => {
            next(error);
        });
    };

    public getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        const ordersList: Order[] = [];
        this.orders.findAllStream({
            onEnd() {
                res.status(200).json(ordersList);
            },
            onNext(doc: Order) {
                ordersList.push(doc);
            },
            onError(error: Error) {
                next(error);
            },
        });
    };

    public deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
        this.orders.delete({
            orderId: Number.parseInt(req.params.id)
        }).then(response => {
            res.status(200).json(response);
        }).catch(error => {
            next(error);
        });
    };

    setupRoutes(app: express.Application) {
        this.router.get(`${this.path}/:id`, this.getOrder);
        this.router.get(`${this.path}`, this.getAllOrders);
        this.router.delete(`${this.path}/:id`, this.deleteOrder);
        app.use('/', this.router);
    }
}
