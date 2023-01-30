import express, { NextFunction, Request, Response, Router } from "express";
import { Collection, DB } from "@tigrisdata/core";
import { User } from "../db/user";
import { Controller } from "./controller";

export class UserController implements Controller {
  private readonly users: Collection<User>;
  private readonly router: Router;
  private readonly path: string;

  constructor(db: DB, app: express.Application) {
    this.users = db.getCollection<User>(User);
    this.path = "/users";
    this.router = Router();
    this.setupRoutes(app);
  }

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    this.users
      .findOne({
        filter: {
          userId: Number.parseInt(req.params.id),
        },
      })
      .then((user) => {
        if (user !== undefined) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      })
      .catch((error) => {
        next(error);
      });
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userList: User[] = [];
    const cursor = this.users.findMany();
    try {
      for await (const doc of cursor) {
        userList.push(doc);
      }
    } catch (error) {
      next(error);
    }
    res.status(200).json(userList);
  };

  public searchUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.body.query;
      c
      if (query === undefined) {
        res.status(400).json({ error: "No search query found in request" });
        return;
      }
      const searchResult = await this.users.search({ q: query as string });
      const resultStream = new Array<User>();
      for await (const res of searchResult) {
        for (const hit of res.hits) resultStream.push(hit.document);
      }
      res.status(200).json(resultStream);
    } catch (error) {
      next(error);
    }
    res.end();
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user: User = req.body;
    this.users
      .insertOne(user)
      .then((user) => {
        res.status(200).json(user);
        return user;
      })
      .catch((error) => {
        next(error);
      });
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = Number.parseInt(req.params.id);

    this.users
      .deleteOne({
        filter: {
          userId: userId,
        },
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        next(error);
      });
  };

  setupRoutes(app: express.Application) {
    this.router.post(`${this.path}/create`, this.createUser);
    this.router.get(`${this.path}/:id`, this.getUser);
    this.router.get(`${this.path}`, this.getAllUsers);
    this.router.post(`${this.path}/search`, this.searchUsers);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    app.use("/", this.router);
  }
}
