import express, { NextFunction, Request, Response, Router } from "express";
import { Collection, DB, Topic } from "@tigrisdata/core";
import { User } from "../models/user";
import { UserEvent } from "../models/user-event";
import { Controller } from "./controller";
import {
  SearchRequest,
  SearchResult,
} from "@tigrisdata/core/dist/search/types";

enum UserEventTypes {
  UserCreated = "user_created",
  UserDeleted = "user_deleted",
}

export class UserController implements Controller {
  private readonly users: Collection<User>;
  private readonly userEvents: Topic<UserEvent>;
  private readonly router: Router;
  private readonly path: string;

  constructor(db: DB, app: express.Application) {
    this.users = db.getCollection<User>("users");
    this.userEvents = db.getTopic<UserEvent>("user_events");
    this.path = "/users";
    this.router = Router();
    this.setupRoutes(app);
  }

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    this.users
      .findOne({
        userId: Number.parseInt(req.params.id),
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
    this.users.findAllStream({
      onEnd() {
        res.status(200).json(userList);
      },
      onNext(doc: User) {
        userList.push(doc);
      },
      onError(error: Error) {
        next(error);
      },
    });
  };

  public searchUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const searchRequest: SearchRequest<User> = req.body;
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
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
      },
    });
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user: User = req.body;
    this.users
      .insert(user)
      .then((user) => {
        res.status(200).json(user);
        return user;
      })
      .then((user) => {
        // Publish an event about the user being created
        const userEvent: UserEvent = {
          userId: user.userId,
          eventType: UserEventTypes.UserCreated,
          eventDescription: `User with ID ${user.userId} has been created`,
        };
        this.userEvents.publish(userEvent);
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
      .delete({
        userId: userId,
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .then(() => {
        // Publish an event about the user being deleted
        const userEvent: UserEvent = {
          userId: userId,
          eventType: UserEventTypes.UserDeleted,
          eventDescription: `User with ID ${userId} has been deleted`,
        };
        this.userEvents.publish(userEvent);
      })
      .catch((error) => {
        next(error);
      });
  };

  public subscribe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.userEvents.subscribe({
      onNext(userEvent: UserEvent) {
        res.write(JSON.stringify(userEvent) + "\n");
      },
      onEnd() {
        res.end();
      },
      onError(error: Error) {
        next(error);
      },
    });
  };

  setupRoutes(app: express.Application) {
    this.router.post(`${this.path}/create`, this.createUser);
    this.router.get(`${this.path}/:id`, this.getUser);
    this.router.get(`${this.path}`, this.getAllUsers);
    this.router.post(`${this.path}/search`, this.searchUsers);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.post(`${this.path}/subscribe`, this.subscribe);
    app.use("/", this.router);
  }
}
