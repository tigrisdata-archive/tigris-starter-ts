import express from "express";

export interface Controller {
    setupRoutes(app: express.Application);
}
