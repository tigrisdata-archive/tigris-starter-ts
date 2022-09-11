import express, {NextFunction, Request, Response, Router} from "express";
import {DB, Topic} from "@tigrisdata/core";
import {Controller} from "./controller";
import {UserEvent} from "../models/user-event";

export class UserEventController implements Controller {
    private readonly userEvents: Topic<UserEvent>;
    private readonly router: Router;
    private readonly path: string;

    constructor(db: DB, app: express.Application) {
        this.userEvents = db.getTopic<UserEvent>('user_events');
        this.path = '/user_events';
        this.router = Router();
        this.setupRoutes(app);
    }

    public publish = async (req: Request, res: Response, next: NextFunction) => {
        const userEvent: UserEvent = req.body;
        this.userEvents.publish(userEvent).then(() => {
            res.status(200).json(userEvent);
        }).catch(error => {
            next(error);
        });
    };

    public subscribe = async (req: Request, res: Response, next: NextFunction) => {
        this.userEvents.subscribe( {
            onNext(userEvent: UserEvent) {
              res.write(JSON.stringify(userEvent) + '\n');
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
