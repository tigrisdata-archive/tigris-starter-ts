import express, {NextFunction, Request, Response, Router} from "express";
import {Collection, DB} from "@tigrisdata/core";
import {User} from "../models/user";
import {Controller} from "./controller";
import {SearchRequest, SearchResult} from "@tigrisdata/core/dist/search/types";

export class UserController implements Controller {

    private readonly users: Collection<User>;
    private readonly router: Router;
    private readonly path: string;

    constructor(db: DB, app: express.Application) {
        this.users = db.getCollection<User>('users');
        this.path = '/users';
        this.router = Router();
        this.setupRoutes(app);
    }

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        this.users.findOne({
            userId: Number.parseInt(req.params.id)
        }).then(user => {
            if (user !== undefined) {
                res.status(200).json(user);
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }).catch(error => {
            next(error);
        });
    };

    public searchUsers = async (req: Request, res: Response, next: NextFunction) => {
        const searchRequest: SearchRequest<User> = req.body;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        this.users.search(searchRequest, {
            onNext(result: SearchResult<User>) {
                res.write(JSON.stringify(result));
            },
            onError(error: Error) {
                res.end();
                next(error);
            },
            onEnd() {
                res.end();
            }
        });
    };

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        const user: User = req.body;
        this.users.insert(user).then(user => {
            res.status(200).json(user);
        }).catch(error => {
            next(error);
        });
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        this.users.delete({
            userId: Number.parseInt(req.params.id)
        }).then(response => {
            res.status(200).json(response);
        }).catch(error => {
            next(error);
        });
    };

    setupRoutes(app: express.Application) {
        this.router.post(`${this.path}/create`, this.createUser);
        this.router.get(`${this.path}/:id`, this.getUser);
        this.router.post(`${this.path}/search`, this.searchUsers);
        this.router.delete(`${this.path}/:id`, this.deleteUser);
        app.use('/', this.router);
    }
}
