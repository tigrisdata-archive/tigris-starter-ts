import express, { NextFunction, Request, Response, Router } from "express";
import { Collection, DB } from "@tigrisdata/core";
import { Product } from "../db/product";
import { Controller } from "./controller";

export class ProductController implements Controller {
  private readonly products: Collection<Product>;
  private readonly router: Router;
  private readonly path: string;

  constructor(db: DB, app: express.Application) {
    this.products = db.getCollection<Product>(Product);
    this.path = "/products";
    this.router = Router();
    this.setupRoutes(app);
  }

  public getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.products
      .findOne({
        filter: {
          productId: req.params.id,
        },
      })
      .then((product) => {
        if (product !== undefined) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      })
      .catch((error) => {
        next(error);
      });
  };

  public getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const cursor = this.products.findMany();
    cursor
      .toArray()
      .then((productList) => res.status(200).json(productList))
      .catch((error) => next(error));
  };

  public searchProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query["q"];
      if (query === undefined) {
        res.status(400).json({ error: "No search query found in request" });
        return;
      }
      const searchResult = await this.products.search({ q: query as string });
      const productHits = new Array<Product>();
      for await (const res of searchResult) {
        for (const hit of res.hits) productHits.push(hit.document);
      }
      res.status(200).json(productHits);
    } catch (error) {
      next(error);
    }
    res.end();
  };

  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const product: Product = req.body;
    this.products
      .insertOne(product)
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((error) => {
        next(error);
      });
  };

  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.products
      .deleteOne({
        filter: {
          productId: req.params.id,
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
    this.router.post(`${this.path}/create`, this.createProduct);
    this.router.get(`${this.path}/:id`, this.getProduct);
    this.router.get(`${this.path}`, this.getAllProducts);
    this.router.get(`${this.path}/search`, this.searchProducts);
    this.router.delete(`${this.path}/:id`, this.deleteProduct);
    app.use("/", this.router);
  }
}
