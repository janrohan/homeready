import express from "express";
import { getMortgagePrediction } from "../controllers/mortgageController.js";

const router = express.Router();

router.post("/predict", getMortgagePrediction);

export default router;