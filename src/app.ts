import express from "express";
import { DB, Tigris } from "@tigrisdata/core";
import { UserController } from "./controllers/user-controller";
import { ProductController } from "./controllers/product-controller";
import { OrderController } from "./controllers/order-controller";
import { User } from "./db/models/user";
import { Product } from "./db/models/product";
import { Order } from "./db/models/order";

export class App {
  private readonly app: express.Application;
  private readonly port: string | number;
  private readonly dbName: string;
  private readonly tigrisClient: Tigris;
  private tigrisDB: DB;

  constructor() {
    this.app = express();
    this.port = 8080;
    this.dbName = "foo";

    // setup client
    this.tigrisClient = new Tigris();

    this.setup();
  }

  public async setup() {
    this.app.use(express.json());
    this.app.use(express.static("public"));
    await this.initializeTigris();
    await this.setupControllers();
  }

  public async initializeTigris() {
    // ensure branch exists, create it if it needs to be created dynamically
    await this.tigrisClient.getDatabase().initializeBranch();
    // register schemas
    await this.tigrisClient.registerSchemas([Product, User, Order]);
    this.tigrisDB = this.tigrisClient.getDatabase();
  }

  public setupControllers() {
    new UserController(this.tigrisDB, this.app);
    new ProductController(this.tigrisDB, this.app);
    new OrderController(this.tigrisDB, this.app);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${this.port}`
      );
    });
  }
}
