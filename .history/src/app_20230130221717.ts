import express from "express";
import { DB, Tigris } from "@tigrisdata/core";
import { UserController } from "./controllers/user-controller";
import { ProductController } from "./controllers/product-controller";
import { OrderController } from "./controllers/order-controller";
import { User } from "./db/user";
import { Product} from "./db/product";
import { Order} from "./db/order";

export class App {
  private readonly app: express.Application;
  private readonly port: string | number;
  private readonly dbName: string;
  private readonly tigris: Tigris;
  private readonly db : DB;


  constructor() {
    this.app = express();
    this.port = 8080;
    this.dbName = "foo";

    // For the Tigris preview environment use the following initialization.
    // Configuration input is supplied from .env file - refer to README.md
    this.tigris = new Tigris();

  

    this.setup();
  }

  public async setup() {
    this.app.use(express.json());
    this.app.use(express.static("public"));
    await this.initializeTigris();
    await this.setupControllers();
  }

  public async initializeTigris() {
      // setup client
  const tigrisClient = new Tigris();
  // ensure branch exists, create it if it needs to be created dynamically
  await tigrisClient.getDatabase().initializeBranch();
  // register schemas
  await tigrisClient.registerSchemas([Product,User,Order]);
  const tigrisDB: DB = tigrisClient.getDatabase();

  }

  public setupControllers() {
    new UserController(this.tigris, this.app);
    new ProductController(this.tigris, this.app);
    new OrderController(this.tigris, this.app);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${this.port}`
      );
    });
  }
}
