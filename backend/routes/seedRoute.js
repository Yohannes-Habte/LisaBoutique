import express from "express";
import createProduct from "../controllers/seedController.js";

const seedRouter = express.Router();

seedRouter.get("/", createProduct);

export default seedRouter;