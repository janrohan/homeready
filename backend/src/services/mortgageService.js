import axios from "axios";

const FASTAPI_URL = "http://localhost:8000/predict"; // your ML service

export const requestPrediction = async (payload) => {
  const response = await axios.post(FASTAPI_URL, payload);
  return response.data; 
};