import express from "express";
import {DB, Tigris} from "@tigrisdata/core";
import {User, userSchema} from "./models/user";
import {Product, productSchema} from "./models/product";
import {Order, orderSchema} from "./models/order";
import {UserController} from "./controllers/user-controller";
import {ProductController} from "./controllers/product-controller";
import {OrderController} from "./controllers/order-controller";

export class App {
    private readonly app: express.Application;
    private readonly port: string | number;
    private readonly dbName: string;
    private readonly tigris: Tigris;
    private db: DB;

    constructor() {
        this.app = express();
        this.port = 8080;
        this.dbName = 'hello-db4';
        this.tigris = new Tigris({
            serverUrl: 'localhost:8081'
        });

        this.setup();
    }

    public async setup() {
        this.app.use(express.json());
        await this.initializeTigris();
        await this.setupControllers();
    }

    public async initializeTigris() {
        // create database (if not exists)
        this.db = await this.tigris.createDatabaseIfNotExists(this.dbName);
        console.log('db: ' + this.dbName + ' created successfully');

        // register collections schema and wait for it to finish
        await Promise.all([
            this.db.createOrUpdateCollection<User>('users', userSchema),
            this.db.createOrUpdateCollection<Product>('products', productSchema),
            this.db.createOrUpdateCollection<Order>('orders', orderSchema)
        ]);
    }

    public setupControllers() {
        new UserController(this.db, this.app);
        new ProductController(this.db, this.app);
        new OrderController(this.db, this.app);
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${this.port}`);
        });
    }
}
