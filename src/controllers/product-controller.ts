import express, {NextFunction, Request, Response, Router} from "express";
import {Collection, DB} from "@tigrisdata/core";
import {Product} from "../models/product";
import {SelectorFilterOperator} from "@tigrisdata/core/dist/types";
import {Controller} from "./controller";

export class ProductController implements Controller {

    private readonly products: Collection<Product>;
    private readonly router: Router;
    private readonly path: string;

    constructor(db: DB, app: express.Application) {
        this.products = db.getCollection<Product>('products');
        this.path = '/products';
        this.router = Router();
        this.setupRoutes(app);
    }

    public getProduct = async (req: Request, res: Response, next: NextFunction) => {
        this.products.readOne({
            op: SelectorFilterOperator.EQ,
            fields: {
                productId: Number.parseInt(req.params.id)
            }
        }).then(product => {
            if(product !== undefined) {
                res.status(200).json(product);
            }else{
                res.status(404).json({error: 'Product not found'});
            }
        }).catch(error => {
            next(error);
        });
    };

    public createProduct = async (req: Request, res: Response, next: NextFunction) => {
        const product: Product = req.body;
        this.products.insert(product).then(product => {
            res.status(200).json(product);
        }).catch(error => {
            next(error);
        });
    };

    public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        this.products.delete({
            op: SelectorFilterOperator.EQ,
            fields: {
                productId: Number.parseInt(req.params.id)
            }
        }).then(response => {
            res.status(200).json(response);
        }).catch(error => {
            next(error);
        });
    };

    setupRoutes(app: express.Application) {
        this.router.post(`${this.path}/create`, this.createProduct);
        this.router.get(`${this.path}/:id`, this.getProduct);
        this.router.delete(`${this.path}/:id`, this.deleteProduct);
        app.use('/', this.router);
    }
}
