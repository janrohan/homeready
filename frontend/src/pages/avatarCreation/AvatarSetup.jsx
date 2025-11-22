// src/pages/avatarCreation/AvatarSetup.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// -----------------------------
// CONSTANTS (match ML model)
// -----------------------------

const REGIONS = [
  { value: "BY", label: "Bayern (BY)" },
  { value: "BW", label: "Baden-Württemberg (BW)" },
  { value: "BE", label: "Berlin (BE)" },
  { value: "HH", label: "Hamburg (HH)" },
  { value: "NW", label: "Nordrhein-Westfalen (NW)" },
  { value: "HE", label: "Hessen (HE)" },
];

const EDUCATION_LEVELS = [
  { key: "none", label: "No Degree" },
  { key: "apprenticeship", label: "Apprenticeship" },
  { key: "bachelor", label: "Bachelor" },
  { key: "master", label: "Master" },
];

const EDUCATION_FIELDS = {
  none: ["none"],
  apprenticeship: ["Retail", "OfficeAdmin", "Logistics", "SkilledTrade", "Mechatronics"],
  bachelor: [
    "business",
    "economics",
    "psychology",
    "education",
    "engineering",
    "data_science",
    "computer_science",
    "mathematics",
    "healthcare",
    "social_sciences",
    "arts_humanities",
  ],
  master: [
    "business",
    "economics",
    "psychology",
    "education",
    "engineering",
    "data_science",
    "computer_science",
    "mathematics",
    "healthcare",
    "social_sciences",
    "arts_humanities",
  ],
};

const FIELD_TO_OCC = {
  computer_science: "STEM",
  engineering: "STEM",
  mathematics: "STEM",
  data_science: "STEM",

  economics: "Finance",
  business: "Finance",

  healthcare: "Healthcare",
  education: "Education",

  psychology: "SocialCare",
  social_sciences: "SocialCare",

  arts_humanities: "Arts",

  Retail: "Retail",
  OfficeAdmin: "OfficeAdmin",
  Logistics: "Logistics",
  SkilledTrade: "SkilledTrade",
  Mechatronics: "Mechatronics",

  none: "Service",
};

const OCCUPATION_CATEGORIES = [
  "STEM",
  "Finance",
  "Healthcare",
  "Education",
  "SocialCare",
  "Retail",
  "OfficeAdmin",
  "Logistics",
  "SkilledTrade",
  "Mechatronics",
  "Arts",
  "Service",
];

const OCC_GROWTH = {
  STEM: 0.06,
  Finance: 0.05,
  Healthcare: 0.03,
  Education: 0.025,
  SocialCare: 0.02,
  Logistics: 0.02,
  Retail: 0.015,
  OfficeAdmin: 0.015,
  Arts: 0.01,
  SkilledTrade: 0.025,
  Mechatronics: 0.025,
  Service: 0.01,
};

const PROPERTY_TYPES = ["Apartment", "House", "Loft", "Penthouse"];

const SQM_MAP = {
  Apartment: 60,
  House: 120,
  Loft: 80,
  Penthouse: 100,
};

function AvatarSetup() {
  const navigate = useNavigate();

  // Step state
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Fields
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");

  const [educationLevel, setEducationLevel] = useState("");
  const [educationField, setEducationField] = useState("");
  const [occupationCategory, setOccupationCategory] = useState("");

  const [startingIncome, setStartingIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [savingsRate, setSavingsRate] = useState("");
  const [debt, setDebt] = useState("");

  const [propertyType, setPropertyType] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");

  // -----------------------------
  // VALIDATION PER STEP
  // -----------------------------
  function handleNext() {
    setError("");

    if (step === 1) {
      const trimmed = name.trim();
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\- ]+$/;
      if (!trimmed || !nameRegex.test(trimmed)) {
        setError("Please enter a valid name (letters only, e.g. 'Alex Müller').");
        return;
      }
      localStorage.setItem("avatar_name", trimmed);
      setStep(step + 1);
      return;
    }

    if (step === 2) {
      if (!gender) {
        setError("Please select a gender.");
        return;
      }
      localStorage.setItem("avatar_gender", gender);
      setStep(step + 1);
      return;
    }

    if (step === 3) {
      const n = Number(age);
      if (!age || Number.isNaN(n) || n <= 0) {
        setError("Please enter a valid age (e.g. 23).");
        return;
      }
      localStorage.setItem("avatar_age", age);
      setStep(step + 1);
      return;
    }

    if (step === 4) {
      if (!region) {
        setError("Please select a region.");
        return;
      }
      localStorage.setItem("avatar_region", region);
      setStep(step + 1);
      return;
    }

    if (step === 5) {
      if (!educationLevel) {
        setError("Please select your highest education level.");
        return;
      }
      // reset field if level changed
      if (!EDUCATION_FIELDS[educationLevel]?.includes(educationField)) {
        setEducationField("");
      }
      localStorage.setItem("avatar_education", educationLevel);
      setStep(step + 1);
      return;
    }

    if (step === 6) {
      if (!educationField) {
        setError("Please select your education field (or 'none').");
        return;
      }
      localStorage.setItem("avatar_education_field", educationField);
      setStep(step + 1);
      return;
    }

    if (step === 7) {
      if (!occupationCategory) {
        setError("Please select your current occupation category.");
        return;
      }
      localStorage.setItem("avatar_occupation_category", occupationCategory);
      setStep(step + 1);
      return;
    }

    if (step === 8) {
      const n = Number(startingIncome);
      if (!startingIncome || Number.isNaN(n) || n <= 0) {
        setError("Annual income must be a positive number (e.g. 48000).");
        return;
      }
      localStorage.setItem("avatar_starting_income", startingIncome);
      setStep(step + 1);
      return;
    }

    if (step === 9) {
      const n = Number(savings);
      if (savings === "" || Number.isNaN(n) || n < 0) {
        setError("Savings must be at least 0 (e.g. 12000).");
        return;
      }
      localStorage.setItem("avatar_savings", savings);
      setStep(step + 1);
      return;
    }

    if (step === 10) {
      const n = Number(savingsRate);
      if (savingsRate === "" || Number.isNaN(n) || n < 0 || n > 100) {
        setError("Savings rate must be between 0 and 100 (e.g. 10 for 10%).");
        return;
      }
      localStorage.setItem("avatar_saving_rate", savingsRate);
      setStep(step + 1);
      return;
    }

    if (step === 11) {
      const n = Number(debt);
      if (debt === "" || Number.isNaN(n) || n < 0) {
        setError("Debt must be at least 0 (e.g. 5000).");
        return;
      }
      localStorage.setItem("avatar_debt", debt);
      setStep(step + 1);
      return;
    }

    if (step === 12) {
      if (!propertyType) {
        setError("Please select a property type.");
        return;
      }
      localStorage.setItem("avatar_property_type", propertyType);
      setStep(step + 1);
      return;
    }

    if (step === 13) {
      const n = Number(propertyPrice);
      if (!propertyPrice || Number.isNaN(n) || n <= 0) {
        setError("Property price must be a positive number (e.g. 420000).");
        return;
      }
      localStorage.setItem("avatar_property_price", propertyPrice);
      handleAvatarCompleted();
      return;
    }
  }

  function handleBack() {
    setError("");
    if (step > 1) setStep(step - 1);
  }

  function handleClose() {
    navigate("/app/story");
  }

  function handleAvatarCompleted() {
    navigate("/app/story");
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="relative">
      {/* Close button top-right */}
      <button
        onClick={handleClose}
        className="absolute right-0 top-0 text-slate-400 hover:text-slate-700 text-xl"
        aria-label="Close"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4">Create Your Avatar</h2>

      <div className="space-y-5">
        {/* STEP 1: NAME */}
        {step === 1 && (
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Alex Müller"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* STEP 2: GENDER */}
        {step === 2 && (
          <div>
            <label className="block text-sm mb-2">Gender</label>
            <div className="flex gap-3">
              {[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "nonbinary", label: "Non-binary" },
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border text-sm ${
                    gender === g.value
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-800 border-slate-300"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: AGE */}
        {step === 3 && (
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 23"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        )}

        {/* STEP 4: REGION */}
        {step === 4 && (
          <div>
            <label className="block text-sm mb-1">Region</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Select region</option>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* STEP 5: EDUCATION LEVEL */}
        {step === 5 && (
          <div>
            <label className="block text-sm mb-2">Highest education level</label>
            <div className="flex flex-wrap gap-2">
              {EDUCATION_LEVELS.map((lvl) => (
                <button
                  key={lvl.key}
                  type="button"
                  onClick={() => setEducationLevel(lvl.key)}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    educationLevel === lvl.key
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-800 border-slate-300"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: EDUCATION FIELD */}
        {step === 6 && (
          <div>
            <label className="block text-sm mb-1">
              Field of study / training
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={educationField}
              onChange={(e) => setEducationField(e.target.value)}
            >
              <option value="">Select field (or 'none')</option>
              {(EDUCATION_FIELDS[educationLevel] || []).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* STEP 7: OCCUPATION CATEGORY */}
        {step === 7 && (
          <div>
            <label className="block text-sm mb-1">
              Current occupation category
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={occupationCategory}
              onChange={(e) => setOccupationCategory(e.target.value)}
            >
              <option value="">Select occupation</option>
              {OCCUPATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* STEP 8: STARTING INCOME (ANNUAL) */}
        {step === 8 && (
          <div>
            <label className="block text-sm mb-1">
              Annual income (before tax, in €)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 48000"
              value={startingIncome}
              onChange={(e) => setStartingIncome(e.target.value)}
            />
          </div>
        )}

        {/* STEP 9: SAVINGS */}
        {step === 9 && (
          <div>
            <label className="block text-sm mb-1">Current savings (€)</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 12000"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
            />
          </div>
        )}

        {/* STEP 10: SAVINGS RATE */}
        {step === 10 && (
          <div>
            <label className="block text-sm mb-1">
              Savings rate (% of income)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 10 (for 10%)"
              value={savingsRate}
              onChange={(e) => setSavingsRate(e.target.value)}
            />
          </div>
        )}

        {/* STEP 11: DEBT */}
        {step === 11 && (
          <div>
            <label className="block text-sm mb-1">Current debt (€)</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 5000"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
            />
          </div>
        )}

        {/* STEP 12: PROPERTY TYPE */}
        {step === 12 && (
          <div>
            <label className="block text-sm mb-2">Desired property type</label>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    propertyType === type
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-800 border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 13: PROPERTY PRICE */}
        {step === 13 && (
          <div>
            <label className="block text-sm mb-1">
              Target property price (€)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 420000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(e.target.value)}
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>
        )}
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="border border-slate-300 text-slate-700 rounded-lg px-4 py-2 text-sm"
          >
            Back
          </button>
        )}

        {step < 13 && (
          <button
            onClick={handleNext}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
          >
            Continue
          </button>
        )}

        {step === 13 && (
          <button
            onClick={handleAvatarCompleted}
            className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm">
            Finish & Calculate
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


