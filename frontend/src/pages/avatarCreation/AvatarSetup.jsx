import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AvatarSetup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  function handleNameContinue() {
    setError("");
    if (!name.trim()) {
      setError("Please enter a name to continue.");
      return;
    }
    // persist partially so other steps can access
    try {
      localStorage.setItem("avatar_name", name.trim());
    } catch (e) {}
    setStep(2);
  }

  function handleGenderBack() {
    setError("");
    setStep(1);
  }

  function handleGenderContinue() {
    setError("");
    if (!gender) {
      setError("Please select a gender to continue.");
      return;
    }
    try {
      localStorage.setItem("avatar_gender", gender);
    } catch (e) {}
    setStep(3);
  }

  function handleAgeBack() {
    setError("");
    setStep(2);
  }

  function handleAgeContinue() {
    setError("");
    const n = Number(age);
    if (!age || Number.isNaN(n) || n <= 0) {
      setError("Please enter a valid age.");
      return;
    }
    try {
      localStorage.setItem("avatar_age", String(n));
    } catch (e) {}
    // später: Validierung / Daten speichern
    navigate("/avatar/questions");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Avatar</h2>
      <p className="text-sm text-slate-600 mb-4">
        Here you define basic data such as name, age, income, savings, etc.
      </p>

      <div className="space-y-3">
        {step === 1 && (
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="z. B. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm mb-3">Gender</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`px-4 py-2 rounded-lg text-sm border ${gender === "male" ? "bg-slate-900 text-white" : "bg-white text-gray-800"}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`px-4 py-2 rounded-lg text-sm border ${gender === "female" ? "bg-slate-900 text-white" : "bg-white text-gray-800"}`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGender("other")}
                className={`px-4 py-2 rounded-lg text-sm border ${gender === "other" ? "bg-slate-900 text-white" : "bg-white text-gray-800"}`}
              >
                Other
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="z. B. 28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        {step === 2 && (
          <button
            onClick={handleGenderBack}
            className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm"
          >
            Back
          </button>
        )}

        {step === 1 && (
          <button
            onClick={handleNameContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 2 && (
          <button
            onClick={handleGenderContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 3 && (
          <button
            onClick={handleAgeContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

export default AvatarSetup;