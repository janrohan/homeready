import axios from "axios";

const API_BASE = "http://localhost:3000/api/mortgage";

export async function getMortgagePrediction(input) {
  const res = await axios.post(`${API_BASE}/predict`, input);
  return res.data; // returns { message, feasible, years_to_readiness }
}