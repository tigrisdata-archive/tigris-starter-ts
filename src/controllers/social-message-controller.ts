import express, {NextFunction, Request, Response, Router} from "express";
import {DB, Topic} from "@tigrisdata/core";
import {SocialMessage} from "../models/social-message";
import {Controller} from "./controller";

export class SocialMessageController implements Controller {

    private readonly socialMessages: Topic<SocialMessage>;
    private readonly router: Router;
    private readonly path: string;

    constructor(db: DB, app: express.Application) {
        this.socialMessages = db.getTopic<SocialMessage>('social_messages');
        this.path = '/social-messages';
        this.router = Router();
        this.setupRoutes(app);
    }

    public publish = async (req: Request, res: Response, next: NextFunction) => {
        const message: SocialMessage = req.body;
        this.socialMessages.publish(
            message
        ).then(response => {
            res.status(200).json(response);
        }).catch(error => {
            next(error);
        });
    };

    public subscribe = async (req: Request, res: Response, next: NextFunction) => {
        this.socialMessages.subscribe( {
            onNext(message: SocialMessage) {
                res.write(JSON.stringify(message) + '\n');
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
