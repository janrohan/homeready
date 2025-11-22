import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AvatarSetup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [educationField, setEducationField] = useState("");
  const [occupation, setOccupation] = useState("");
  const [savings, setSavings] = useState("");
  const [income, setIncome] = useState("");
  const [debt, setDebt] = useState("");
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
    // proceed to next questions
    setStep(4);
  }

  function handleEducationBack() {
    setError("");
    setStep(3);
  }

  function handleEducationContinue() {
    setError("");
    if (!education) {
      setError("Please choose your highest education level.");
      return;
    }
    try {
      localStorage.setItem("avatar_education", education);
    } catch (e) {}
    // if no higher education selected, skip education field question
    if (education === "Bachelor" || education === "Master" || education === "PhD") {
      setStep(5);
    } else {
      setStep(6);
    }
  }

  function handleEducationFieldBack() {
    setError("");
    setStep(4);
  }

  function handleEducationFieldContinue() {
    setError("");
    if (!educationField.trim()) {
      setError("Please enter the field of study.");
      return;
    }
    try {
      localStorage.setItem("avatar_education_field", educationField.trim());
    } catch (e) {}
    setStep(6);
  }

  function handleOccupationBack() {
    // go back to either education field or education depending on flow
    setError("");
    if (education === "Bachelor" || education === "Master" || education === "PhD") {
      setStep(5);
    } else {
      setStep(4);
    }
  }

  function handleOccupationContinue() {
    setError("");
    if (!occupation.trim()) {
      setError("Please enter your current occupation.");
      return;
    }
    try {
      localStorage.setItem("avatar_occupation", occupation.trim());
    } catch (e) {}
    setStep(7);
  }

  function handleSavingsBack() {
    setError("");
    setStep(6);
  }

  function handleSavingsContinue() {
    setError("");
    const v = Number(savings);
    if (savings === "" || Number.isNaN(v) || v < 0) {
      setError("Please enter a valid savings amount (>= 0).");
      return;
    }
    try {
      localStorage.setItem("avatar_savings", String(v));
    } catch (e) {}
    setStep(8);
  }

  function handleIncomeBack() {
    setError("");
    setStep(7);
  }

  function handleIncomeContinue() {
    setError("");
    const v = Number(income);
    if (income === "" || Number.isNaN(v) || v < 0) {
      setError("Please enter a valid monthly income (>= 0).");
      return;
    }
    try {
      localStorage.setItem("avatar_income", String(v));
    } catch (e) {}
    setStep(9);
  }

  function handleDebtBack() {
    setError("");
    setStep(8);
  }

  function handleDebtContinue() {
    setError("");
    const v = Number(debt);
    if (debt === "" || Number.isNaN(v) || v < 0) {
      setError("Please enter a valid debt amount (>= 0).");
      return;
    }
    try {
      localStorage.setItem("avatar_debt", String(v));
    } catch (e) {}
    // finished questions — navigate to next page
    navigate("/avatar/questions");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Avatar</h2>
      <p className="text-sm text-slate-600 mb-4">
        Please enter some information about your avatar to get started.
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
            <div className="flex gap-4 justify-center items-center">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`w-32 px-6 py-3 text-base font-medium rounded-lg border shadow-sm hover:shadow-md focus:outline-none ${gender === "male" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-800 border-gray-200"}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`w-32 px-6 py-3 text-base font-medium rounded-lg border shadow-sm hover:shadow-md focus:outline-none ${gender === "female" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-800 border-gray-200"}`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGender("other")}
                className={`w-32 px-6 py-3 text-base font-medium rounded-lg border shadow-sm hover:shadow-md focus:outline-none ${gender === "other" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-800 border-gray-200"}`}
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

        {step === 4 && (
          <div>
            <label className="block text-sm mb-3">What is the highest level of education you reached?</label>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              {[
                "School",
                "Bachelor",
                "Master",
                "PhD",
                "None",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setEducation(opt)}
                  className={`w-40 px-6 py-3 text-base font-medium rounded-lg border shadow-sm hover:shadow-md focus:outline-none ${education === opt ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-800 border-gray-200"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <label className="block text-sm mb-1">If you completed higher education, what field was it in?</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Computer Science"
              value={educationField}
              onChange={(e) => setEducationField(e.target.value)}
            />
          </div>
        )}

        {step === 6 && (
          <div>
            <label className="block text-sm mb-1">What is your current occupation?</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Software Engineer"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
        )}

        {step === 7 && (
          <div>
            <label className="block text-sm mb-1">How much money have you saved (in Euros)?</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 10000"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
            />
          </div>
        )}

        {step === 8 && (
          <div>
            <label className="block text-sm mb-1">What is your current income per month?</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 3000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
        )}

        {step === 9 && (
          <div>
            <label className="block text-sm mb-1">How much debt do you currently have?</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 5000"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
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

        {step === 4 && (
          <button
            onClick={handleEducationBack}
            className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm"
          >
            Back
          </button>
        )}

        {step === 5 && (
          <button
            onClick={handleEducationFieldBack}
            className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm"
          >
            Back
          </button>
        )}

        {step === 6 && (
          <button
            onClick={handleOccupationBack}
            className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm"
          >
            Back
          </button>
        )}

        {step === 7 && (
          <button
            onClick={handleSavingsBack}
            className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm"
          >
            Back
          </button>
        )}

        {step === 8 && (
          <button
            onClick={handleIncomeBack}
            className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm"
          >
            Back
          </button>
        )}

        {step === 9 && (
          <button
            onClick={handleDebtBack}
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

        {step === 4 && (
          <button
            onClick={handleEducationContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 5 && (
          <button
            onClick={handleEducationFieldContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 6 && (
          <button
            onClick={handleOccupationContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 7 && (
          <button
            onClick={handleSavingsContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 8 && (
          <button
            onClick={handleIncomeContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 9 && (
          <button
            onClick={handleDebtContinue}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/avatars/createAvatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          name, 
          gender,
          age: Number(age),
          education,
          educationField,
          occupation,
          income: Number(income),
          savings: Number(savings),
          debt: Number(debt),
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const message = errBody.error || errBody.message || "Error creating avatar";
        throw new Error(message);
      }

      console.log("Avatar created successfully");

      // On success, navigate to next step
      navigate("/avatar/questions");
    } catch (error) {
      setError(error.message);
    }
  }

}

export default AvatarSetup;