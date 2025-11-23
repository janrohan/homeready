import { useEffect, useState } from "react";

export default function MortgageTest() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAvatarAndPredict() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        // 1) GET latest avatar
        const avatarRes = await fetch("http://localhost:3000/api/avatars/latest", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!avatarRes.ok) {
          const body = await avatarRes.text();
          setError("Failed to load avatar: " + body);
          return;
        }


        const avatarData = await avatarRes.json();
        console.log("Loaded avatar:", avatarData);

        const avatar = avatarData.avatar;

        console.log("Avatar keys:", Object.keys(avatar));

        const cleaned = {
            age: avatar.age,
            region: avatar.region,
            educationLevel: avatar.educationlevel,
            educationField: avatar.educationfield,
            occupation: avatar.occupation,
            income: avatar.income,
            incomeGrowthRate: avatar.incomegrowthrate,
            savings: avatar.savings,
            savingsRate: avatar.savingsrate,
            debtLevel: avatar.debtlevel,
            propertyPrice: avatar.propertyprice,
            pricePerSqm: avatar.pricepersqm,
            propertyType: avatar.propertytype,
            propertyRegion: avatar.region       // region = property_region
        };

          console.log("PREDICTION PAYLOAD:", cleaned);

         //2) POST to mortgage/predict
         const predictRes = await fetch("http://localhost:3000/api/mortgage/predict", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(cleaned),
         });

         if (!predictRes.ok) {
           const body = await predictRes.text();
           setError("Predict failed: " + body);
           return;
         }

         const predictData = await predictRes.json();
         console.log("Predict result:", predictData);
         setResult(predictData);

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    loadAvatarAndPredict();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔧 Mortgage Prediction Test Page</h1>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
