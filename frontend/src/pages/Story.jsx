// src/pages/Story.jsx
import { useState, useMemo, useEffect } from "react";
import avatarImg from "../assets/male_1.png";
import roadmapImg from "../assets/roadmap_2.png"; // your 1920x1080 background

// ----- Story Configuration -----
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
  },

  masterOption: {
    id: "masterOption",
    title: "Do you want to do a Master’s degree?",
    description:
      "A Master’s gives you more income potential but delays full-time earnings.",
    options: [
      { id: "master_yes", label: "Yes, I’ll do a Master" },
      { id: "master_no", label: "No, Bachelor is enough" },
    ],
    next: () => "educationDoneInterlude",
  },

  apprenticeshipProgram: {
    id: "apprenticeshipProgram",
    title: "Choose your apprenticeship",
    description: "Pick the craft that fits you best.",
    options: [
      { id: "carpenter", label: "Carpenter" },
      { id: "mechatronics", label: "Mechatronics Technician" },
      { id: "electrician", label: "Electrician" },
    ],
    next: () => "educationDoneInterlude",
  },

  educationDoneInterlude: {
    id: "educationDoneInterlude",
    type: "info",
    title: "Congrats! You finished your education 🎓",
    description: "Next: Your career path!",
    next: () => "jobChoice",
  },

  jobChoice: {
    id: "jobChoice",
    dynamic: true,
    title: "Choose your job",
    description: "Your job affects your income and savings potential.",
    next: () => "childrenChoice",
  },

  childrenChoice: {
    id: "childrenChoice",
    title: "Do you want children?",
    description:
      "Children change your monthly expenses — choose what fits your story.",
    options: [
      { id: "children_yes", label: "Yes" },
      { id: "children_no", label: "No" },
    ],
    next: () => "storyEnd",
  },

  storyEnd: {
    id: "storyEnd",
    type: "info",
    title: "Story segment complete 🎉",
    description:
      "We can now calculate the impact of your decisions on your mortgage readiness.",
    next: null,
  },
};

// ----- Ordering for progress bar -----
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

// ----- Dynamic Job Options -----
const jobOptionsByEducation = {
  bachelor: [
    { id: "junior_dev", label: "Junior Developer" },
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

const defaultStoryState = {
  educationLevel: null,
  bachelorProgram: null,
  master: null,
  apprenticeshipProgram: null,
  job: null,
  children: null,
};

// ----- Map Coordinates (for a 1920×1080 background) -----
const mapCoordinates = {
  educationLevel: { x: 250, y: 780 },
  bachelorProgram: { x: 520, y: 720 },
  masterOption: { x: 780, y: 650 },
  apprenticeshipProgram: { x: 520, y: 720 },
  educationDoneInterlude: { x: 1050, y: 620 },
  jobChoice: { x: 1320, y: 600 },
  childrenChoice: { x: 1580, y: 650 },
  storyEnd: { x: 1820, y: 720 },
};

function Story() {
  // track where we are in the story
  const [currentStepId, setCurrentStepId] = useState(() => {
    return localStorage.getItem("storyCurrentStepId") || "educationLevel";
  });

  // state for choices
  const [storyState, setStoryState] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("storyState"));
      return stored ? { ...defaultStoryState, ...stored } : defaultStoryState;
    } catch {
      return defaultStoryState;
    }
  });

  // avatar position
  const [avatarX, setAvatarX] = useState(0);
  const [avatarY, setAvatarY] = useState(0);

  const step = storySteps[currentStepId];

  // Progress %
  const progressPercent = useMemo(() => {
    const idx = stepOrder.indexOf(currentStepId);
    if (idx === -1) return 0;
    return Math.round(((idx + 1) / stepOrder.length) * 100);
  }, [currentStepId]);

  // Move avatar on step change
  useEffect(() => {
    const node = mapCoordinates[currentStepId];
    if (!node) return;
    setAvatarX(node.x);
    setAvatarY(node.y);
  }, [currentStepId]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("storyState", JSON.stringify(storyState));
    localStorage.setItem("storyCurrentStepId", currentStepId);
  }, [storyState, currentStepId]);

  // Dynamic jobs based on education
  const dynamicOptions = useMemo(() => {
    if (currentStepId !== "jobChoice") return null;
    const edu = storyState.educationLevel;

    if (edu === "bachelor" && storyState.master === "master_yes")
      return jobOptionsByEducation.master;

    if (edu === "bachelor")
      return jobOptionsByEducation.bachelor;

    if (edu === "apprenticeship")
      return jobOptionsByEducation.apprenticeship;

    return jobOptionsByEducation[edu] || null;
  }, [currentStepId, storyState]);

  // Handle button press
  function handleOptionSelect(optionId) {
    setStoryState((prev) => ({
      ...prev,
      [currentStepId]: optionId,
    }));

    const nextId = step.next?.(optionId);
    if (nextId) setCurrentStepId(nextId);
  }

  function handleContinue() {
    const nextId = step.next?.();
    if (nextId) setCurrentStepId(nextId);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Story progress
          </span>
          <span className="text-xs text-gray-500">{progressPercent}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden relative">
          <div
            className="h-2 bg-gradient-to-r from-[#589eaf] to-[#94d260] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Roadmap Container */}
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-[#589eaf]/10 bg-slate-900">

        {/* Background Map */}
        <img
          src={roadmapImg}
          alt="Roadmap"
          className="absolute top-0 left-0 w-[1920px] h-[1080px] object-cover"
        />

        {/* Avatar */}
        <div
          className="absolute transition-all duration-700 ease-out"
          style={{
            left: `${avatarX}px`,
            top: `${avatarY}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="h-20 w-20 rounded-full bg-[#589eaf]/20 shadow-xl flex items-center justify-center backdrop-blur">
            <img
              src={avatarImg}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Popup */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl p-6 max-w-md w-[90%] border border-[#589eaf]/10">
            <h2 className="text-2xl font-bold text-[#589eaf] mb-2">
              {step.title}
            </h2>

            <p className="text-sm text-gray-600 mb-4">{step.description}</p>

            {step.type !== "info" && (
              <div className="grid gap-3 md:grid-cols-2">
                {(step.dynamic ? dynamicOptions : step.options)?.map(
                  (option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className="bg-white border border-gray-200 rounded-2xl p-3 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-sm"
                    >
                      {option.label}
                    </button>
                  )
                )}
              </div>
            )}

            {step.type === "info" && (
              <div className="mt-4">
                {step.next ? (
                  <button
                    onClick={handleContinue}
                    className="bg-[#589eaf] text-white rounded-xl px-5 py-2.5 font-medium shadow-sm hover:bg-[#4c8b99] transition"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={() => alert("Coming soon")}
                    className="bg-[#94d260] text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm hover:bg-[#7fb952] transition"
                  >
                    Finish
                  </button>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Story;