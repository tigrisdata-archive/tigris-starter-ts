import express, { NextFunction, Request, Response, Router } from "express";
import { DB, Collection } from "@tigrisdata/core";
import { Order } from "../db/order";
import { Controller } from "./controller";
import { User } from "src/db/user";
import { Product } from "src/db/product";

export class OrderController implements Controller {
  private readonly db: DB;
  private readonly orders: Collection<Order>;
  private readonly router: Router;
  private readonly path: string;

  constructor(db: DB, app: express.Application) {
    this.orders = db.getCollection<Order>(Order);
    this.path = "/orders";
    this.router = Router();
    this.db = db;
    this.setupRoutes(app);
  }

  public getOrder = async (req: Request, res: Response, next: NextFunction) => {
    this.orders
      .findOne({
        filter: {
          orderId: req.params.id,
        },
      })
      .then((order) => {
        if (order !== undefined) {
          res.status(200).json(order);
        } else {
          res.status(404).json({ error: "Order not found" });
        }
      })
      .catch((error) => {
        next(error);
      });
  };

  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const ordersList: Order[] = [];
    const ordersCursor = this.orders.findMany();
    try {
      for await (const doc of ordersCursor) {
        ordersList.push(doc);
      }
    } catch (error) {
      next(error);
    }

    res.status(200).json(ordersList);
  };

  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.orders
      .deleteOne({
        filter: {
          orderId: req.params.id,
        },
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        next(error);
      });
  };
  
  
  public createOrder(req: Request, res: Response, next: NextFunction) {
    const order : Order 
  }
  setupRoutes(app: express.Application) {
    this.router.get(`${this.path}/:id`, this.getOrder);
    this.router.get(`${this.path}`, this.getAllOrders);
    this.router.delete(`${this.path}/:id`, this.deleteOrder);
    app.use("/", this.router);
  }
}
interface OrderData {
  userId: User,
  productId: Product
}
