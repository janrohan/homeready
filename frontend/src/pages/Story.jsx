// src/pages/Story.jsx
import { useState, useMemo, useEffect } from "react";
import avatarImg from "../assets/male_1.png";

// Story configuration
const storySteps = {
  educationLevel: {
    id: "educationLevel",
    title: "Choose your education path",
    description:
      "Your education has a big impact on your income, savings potential and when you can start earning.",
    options: [
      { id: "bachelor", label: "Bachelor’s degree" },
      { id: "apprenticeship", label: "Apprenticeship" },
      { id: "none", label: "No formal education" },
    ],
    next: (choiceId) => {
      if (choiceId === "bachelor") return "bachelorProgram";
      if (choiceId === "apprenticeship") return "apprenticeshipProgram";
      return "educationDoneInterlude";
    },
    avatarText:
      "Education can increase your income – but it also costs time and money. Let’s see what you pick.",
  },

  bachelorProgram: {
    id: "bachelorProgram",
    title: "Pick your Bachelor program",
    description: "What do you want to study?",
    options: [
      { id: "cs", label: "Computer Science" },
      { id: "business", label: "Business Administration" },
      { id: "arts", label: "Arts & Humanities" },
    ],
    next: () => "masterOption",
    avatarText:
      "Different fields lead to different salaries. Tech and business often have strong earning potential.",
  },

  masterOption: {
    id: "masterOption",
    title: "Do you want to do a Master’s degree?",
    description:
      "A Master’s can boost your income, but it also means more years without full-time salary.",
    options: [
      { id: "master_yes", label: "Yes, I’ll do a Master" },
      { id: "master_no", label: "No, Bachelor is enough" },
    ],
    next: () => "educationDoneInterlude",
    avatarText:
      "More education usually means higher long-term income – but also more study years and costs.",
  },

  apprenticeshipProgram: {
    id: "apprenticeshipProgram",
    title: "Choose your apprenticeship",
    description: "Pick the path that fits you best.",
    options: [
      { id: "carpenter", label: "Carpenter training" },
      { id: "mechatronics", label: "Mechatronics technician training" },
      { id: "electrician", label: "Electrician training" },
    ],
    next: () => "educationDoneInterlude",
    avatarText:
      "Apprenticeships let you earn earlier, but with a different long-term salary curve.",
  },

  educationDoneInterlude: {
    id: "educationDoneInterlude",
    type: "info",
    title: "Congrats! You finished your education 🎓",
    description:
      "Nice! Your education journey is complete. Next, we’ll see how your career impacts your home ownership path.",
    next: () => "jobChoice",
    avatarText:
      "Education is done – time to earn money, save, and build your path towards your own place.",
  },

  jobChoice: {
    id: "jobChoice",
    dynamic: true, // options depend on previous choices
    title: "Choose your job",
    description:
      "Your job decides your income, stability and how much you can save for your future home.",
    avatarText:
      "Income, stability, and growth potential all play a role in your mortgage readiness.",
    next: () => "childrenChoice",
  },

  childrenChoice: {
    id: "childrenChoice",
    title: "Do you want children?",
    description:
      "Children are amazing – but they also change your expenses and savings potential.",
    options: [
      { id: "children_yes", label: "Yes, I want children" },
      { id: "children_no", label: "No, I don’t want children" },
    ],
    next: () => "storyEnd",
    avatarText:
      "Family decisions have a big impact on monthly costs and how fast you can save for a home.",
  },

  storyEnd: {
    id: "storyEnd",
    type: "info",
    title: "Story segment complete 🎉",
    description:
      "Great work! In the next steps, we’ll show how your choices impact your home goal and mortgage potential.",
    next: null,
    avatarText:
      "You’ve built your initial life path. We can now translate that into numbers for your home journey.",
  },
};

// Job options depending on education path
const jobOptionsByEducation = {
  bachelor: [
    { id: "junior_dev", label: "Junior Software Developer" },
    { id: "business_analyst", label: "Business Analyst" },
    { id: "marketing_specialist", label: "Marketing Specialist" },
  ],
  master: [
    { id: "software_engineer", label: "Software Engineer" },
    { id: "management_consultant", label: "Management Consultant" },
    { id: "data_scientist", label: "Data Scientist" },
  ],
  apprenticeship: [
    { id: "carpenter_job", label: "Carpenter" },
    { id: "mechanic_job", label: "Mechatronics Technician" },
    { id: "electrician_job", label: "Electrician" },
  ],
  none: [
    { id: "retail_staff", label: "Retail Worker" },
    { id: "delivery_driver", label: "Delivery Driver" },
    { id: "warehouse_worker", label: "Warehouse Worker" },
  ],
};

// Rough step order for a simple progress bar
const stepOrder = [
  "educationLevel",
  "bachelorProgram",
  "masterOption",
  "apprenticeshipProgram",
  "educationDoneInterlude",
  "jobChoice",
  "childrenChoice",
  "storyEnd",
];

const defaultStoryState = {
  educationLevel: null,
  bachelorProgram: null,
  master: null,
  apprenticeshipProgram: null,
  job: null,
  children: null,
};

function Story() {
  const [currentStepId, setCurrentStepId] = useState(() => {
    const stored = localStorage.getItem("storyCurrentStepId");
    return stored || "educationLevel";
  });
  const [storyState, setStoryState] = useState(() => {
    const stored = localStorage.getItem("storyState");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // mit Default-Werten mergen, falls später Felder hinzukommen
        return { ...defaultStoryState, ...parsed };
      } catch {
        return defaultStoryState;
      }
    }
    return defaultStoryState;
  });

  const step = storySteps[currentStepId];

  async function sendStoryToBackend() {
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await fetch("http://localhost:3000/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          decisions: storyState,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save story choices");
      }
  
      console.log("Story saved:", await response.json());
      alert("Your story decisions have been saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving story decisions.");
    }
  }
  useEffect(() => {
    localStorage.setItem("storyState", JSON.stringify(storyState));
    localStorage.setItem("storyCurrentStepId", currentStepId);
  }, [storyState, currentStepId]);

  // Simple progress calculation
  const progressPercent = useMemo(() => {
    const idx = stepOrder.indexOf(currentStepId);
    if (idx === -1) return 0;
    const total = stepOrder.length;
    return Math.round(((idx + 1) / total) * 100);
  }, [currentStepId]);

  // Dynamically compute job options depending on education path
  const dynamicOptions = useMemo(() => {
    if (currentStepId !== "jobChoice") return null;

    const edu = storyState.educationLevel;

    // If bachelor AND master_yes was chosen → master-level jobs
    if (edu === "bachelor" && storyState.master === "master_yes") {
      return jobOptionsByEducation.master;
    }

    // If bachelor without master → bachelor jobs
    if (edu === "bachelor") {
      return jobOptionsByEducation.bachelor;
    }

    // Apprenticeship
    if (edu === "apprenticeship") {
      return jobOptionsByEducation.apprenticeship;
    }

    // None
    if (edu === "none") {
      return jobOptionsByEducation.none;
    }

    return null;
  }, [currentStepId, storyState]);

  function handleOptionSelect(optionId) {
    // Save the choice in state
    setStoryState((prev) => {
      const updated = { ...prev };

      if (currentStepId === "educationLevel") {
        updated.educationLevel = optionId;
      } else if (currentStepId === "bachelorProgram") {
        updated.bachelorProgram = optionId;
      } else if (currentStepId === "masterOption") {
        updated.master = optionId;
      } else if (currentStepId === "apprenticeshipProgram") {
        updated.apprenticeshipProgram = optionId;
      } else if (currentStepId === "jobChoice") {
        updated.job = optionId;
      } else if (currentStepId === "childrenChoice") {
        updated.children = optionId;
      }

      return updated;
    });

    // Move to the next step based on config
    if (step.next) {
      const nextId = step.next(optionId);
      if (nextId && storySteps[nextId]) {
        setCurrentStepId(nextId);
      }
    }
  }

  function handleContinue() {
    if (!step.next) return;
    const nextId = step.next();
    if (nextId && storySteps[nextId]) {
      setCurrentStepId(nextId);
    }
  }

  if (!step) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-600">
          Something went wrong – unknown story step.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Simple progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Story progress
          </span>
          <span className="text-xs text-gray-500">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-[#94d260] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        {/* Main story card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#589eaf] mb-2">
            {step.title}
          </h2>
          <p className="text-sm text-gray-600 mb-6">{step.description}</p>

          {/* Dynamic or static choice-based step */}
          {step.type !== "info" && (
            <div className="grid gap-3 md:grid-cols-3">
              {(step.dynamic ? dynamicOptions : step.options)?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className="
                    text-left bg-white border border-gray-200 
                    rounded-2xl p-4 text-sm 
                    hover:border-[#589eaf] hover:shadow-md 
                    transition
                  "
                >
                  <div className="font-medium mb-1">{option.label}</div>
                  {/* Placeholder for small impact text (later) */}
                  <p className="text-xs text-gray-500">
                    Click to follow this path.
                  </p>
                </button>
              ))}
            </div>
          )}

{step.type === "info" && (
  <div className="mt-4">
    {step.next ? (
      <button
        onClick={handleContinue}
        className="
          inline-flex items-center justify-center
          bg-[#589eaf] text-white rounded-xl
          px-5 py-2.5 text-sm font-medium
          shadow-sm hover:bg-[#4c8b99] transition
        "
      >
        Continue
      </button>
    ) : (
      <button
        onClick={sendStoryToBackend}
        className="
          inline-flex items-center justify-center
          bg-[#94d260] text-white rounded-xl
          px-5 py-2.5 text-sm font-semibold
          shadow-sm hover:bg-[#7fb952] transition
        "
      >
        Save my decisions
      </button>
    )}
  </div>
)}

          {/* Optional: debug block to see current state during development */}
          <div className="mt-6 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-xs text-gray-500">
            <div className="font-semibold mb-1">Your current path (debug)</div>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(storyState, null, 2)}
            </pre>
          </div>
        </div>

        {/* Avatar fun-fact bubble */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-[#589eaf]/10 flex items-center justify-center mb-4">
            <img
              src={avatarImg}
              alt="Story avatar"
              className="h-20 w-20 object-cover rounded-full"
            />
          </div>
          <div className="bg-[#589eaf]/10 text-[#589eaf] rounded-2xl px-4 py-3 text-sm text-center">
            {step.avatarText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Story;