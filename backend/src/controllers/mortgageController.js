import { requestPrediction } from "../services/mortgageService.js";

export const getMortgagePrediction = async (req, res) => {
  try {
    const avatarInput = req.body;

    const prediction = await requestPrediction(avatarInput);

    const years = prediction.years_to_readiness;

    let message;
    let feasible;

    if (years >= 40) {
      feasible = false;
      message =
        "Based on your current situation and savings, reaching mortgage readiness may not be realistic without major changes.";
    } else {
      feasible = true;
      message = `You could be mortgage-ready in approximately ${years.toFixed(
        1
      )} years.`;
    }

    return res.json({
      success: true,
      years_to_readiness: years,
      feasible,
      message,
    });

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ success: false, error: "ML service unavailable" });
  }
};