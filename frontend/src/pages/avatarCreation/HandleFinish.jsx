import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function HandleFinish() {
  const navigate = useNavigate();
  const location = useLocation();

  // Expect selected listing from previous page
  const selectedListing = location.state?.selectedListing;

  useEffect(() => {
    async function sendData() {
      if (!selectedListing) {
        console.error("No listing selected!");
        navigate("/avatar"); 
        return;
      }

      const avatar = {
        age: Number(localStorage.getItem("avatar_age")),
        region: localStorage.getItem("avatar_region"),
        education_level: localStorage.getItem("avatar_education"),
        education_field: localStorage.getItem("avatar_education_field") || "none",
        occupation_category: localStorage.getItem("avatar_occupation_category"),
        starting_income: Number(localStorage.getItem("avatar_starting_income")),
        current_savings: Number(localStorage.getItem("avatar_savings")),
        savings_rate: Number(localStorage.getItem("avatar_saving_rate")),
        debt_level: Number(localStorage.getItem("avatar_debt")),
        property_price: Number(selectedListing.price),
        price_per_sqm: Number(selectedListing.pricePerSqm),
        property_type: selectedListing.type,
        property_region: selectedListing.region
      };

      try {
        const response = await fetch("http://localhost:3000/api/mortgage/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(avatar),
        });

        const result = await response.json();
        localStorage.setItem("mortgage_result", JSON.stringify(result));

        navigate("/app/story");

      } catch (e) {
        console.error("Error sending data", e);
      }
    }

    sendData();
  }, [navigate, selectedListing]);

  return (
    <div className="p-4 text-center text-slate-600">
      <p>Calculating your mortgage readiness…</p>
    </div>
  );
}
