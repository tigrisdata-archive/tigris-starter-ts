import express, {NextFunction, Request, Response, Router} from "express";
import {DB, Topic} from "@tigrisdata/core";
import {Controller} from "./controller";
import {ProductUpdate} from "../models/product-update";

export class ProductUpdateController implements Controller {
    private readonly productUpdates: Topic<ProductUpdate>;
    private readonly router: Router;
    private readonly path: string;

    constructor(db: DB, app: express.Application) {
        this.productUpdates = db.getTopic<ProductUpdate>('product_updates');
        this.path = '/product_updates';
        this.router = Router();
        this.setupRoutes(app);
    }

    public publish = async (req: Request, res: Response, next: NextFunction) => {
        const productUpdate: ProductUpdate = req.body;
        this.productUpdates.publish(productUpdate).then(() => {
            res.status(200).json(productUpdate);
        }).catch(error => {
            next(error);
        });
    };

    public subscribe = async (req: Request, res: Response, next: NextFunction) => {
        this.productUpdates.subscribe( {
            onNext(productUpdate: ProductUpdate) {
              res.write(JSON.stringify(productUpdate) + '\n');
            },
            onEnd() {
                res.end();
            },
            onError(error: Error) {
                next(error);
            }
        });
    };

    setupRoutes(app: express.Application) {
        this.router.post(`${this.path}/publish`, this.publish);
        this.router.post(`${this.path}/subscribe`, this.subscribe);
        app.use('/', this.router);
    }
}
