import express from "express"
import { getLisaShirt } from "../controllers/productConreoller.js";

const aboutRouter = express.Router();

aboutRouter.get("/shirt", getLisaShirt)

export default aboutRouter;