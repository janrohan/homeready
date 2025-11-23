// src/services/getMortgagePrediction.js

export async function getMortgagePrediction(payload) {
    console.log("📤 Sending mortgage prediction payload:", payload);
  
    try {
      const response = await fetch("http://localhost:3000/api/mortgage/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add user auth if backend requires it:
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });
  
      // Response not OK → Throw
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Predict backend returned error:", errorText);
        throw new Error(`Backend error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("✅ Mortgage prediction received:", data);
  
      return data;
  
    } catch (error) {
      console.error("❌ getMortgagePrediction failed:", error);
      throw error;
    }
  }
  