import express from "express"
import { createTestimonial } from "../controllers/testimonialController.js";

const testimoniaRrouter = express.Router();

testimoniaRrouter.post("/", createTestimonial);

export default testimoniaRrouter;