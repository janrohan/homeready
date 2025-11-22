import { requestPrediction } from "../services/mortgageService.js";

export const getMortgagePrediction = async (req, res) => {
  try {
    const avatarInput = req.body;

    const prediction = await requestPrediction(avatarInput);

    res.json({
      success: true,
      prediction: prediction.years_to_readiness
    });

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ success: false, error: "ML service unavailable" });
  }
};