import express, { NextFunction, Request, Response, Router } from "express";
import { Collection, DB } from "@tigrisdata/core";
import { Product } from "../db/product";
import { Controller } from "./controller";
import { SearchRequest } from "@tigrisdata/core/dist/search/types";


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
    const query = req.query["q"];
    if (query === undefined) {
      res.status(400).json({ error: "No search query found in request" });
      return;
    }
    const searchRequest: SearchRequest<Product> = { q: query as string };
    const searchResult = await commentCollection.search(searchRequest);
    const comment = new Array<Product>();
    for (const hit of searchResult.hits) {
      comment.push(hit.document);
    }
    const searchRequest: SearchRequest<Product> = req.body;
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const resultStream = this.products.search(searchRequest);
    try {
      for await (const result of resultStream) {
        res.write(JSON.stringify(result));
      }
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
    this.router.post(`${this.path}/search`, this.searchProducts);
    this.router.delete(`${this.path}/:id`, this.deleteProduct);
    app.use("/", this.router);
  }
}
