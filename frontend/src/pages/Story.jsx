// src/pages/Story.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";              // ⬅️ NEW
import avatarMale from "../assets/male_1.png";
import avatarFemale from "../assets/female_1.png";
import avatarNeutral from "../assets/nonbinary_1.png";
import roadmapBg from "../assets/roadmap_2.png";

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

// ----- Avatar positions on the 1920x1080 roadmap -----
const avatarPositions = {
  educationLevel: { x: 18, y: 55 },
  bachelorProgram: { x: 35, y: 33 },
  masterOption: { x: 47, y: 33 },
  apprenticeshipProgram: { x: 35, y: 33 },
  educationDoneInterlude: { x: 50, y: 55 },
  jobChoice: { x: 60, y: 69 },
  childrenChoice: { x: 76, y: 29 },
  storyEnd: { x: 85, y: 39 },
};

function Story() {
  const navigate = useNavigate();                         // ⬅️ NEW

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

  const [avatarGender, setAvatarGender] = useState("neutral");

  useEffect(() => {
    const storedGender = localStorage.getItem("avatar_gender");
    if (storedGender === "male" || storedGender === "female" || storedGender === "nonbinary") {
      setAvatarGender(storedGender);
    }
  }, []);

  const avatarImg = useMemo(() => {
    if (avatarGender === "male") return avatarMale;
    if (avatarGender === "female") return avatarFemale;
    if (avatarGender === "nonbinary") return avatarNeutral;
    return avatarNeutral; // fallback
  }, [avatarGender]);

  // control visibility of the question card
  const [isCardVisible, setIsCardVisible] = useState(true);

  const step = storySteps[currentStepId];

  // Progress %
  const progressPercent = useMemo(() => {
    const idx = stepOrder.indexOf(currentStepId);
    if (idx === -1) return 0;
    return Math.round(((idx + 1) / stepOrder.length) * 100);
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

    if (edu === "bachelor" && storyState.master === "master_yes") {
      return jobOptionsByEducation.master;
    }

    if (edu === "bachelor") {
      return jobOptionsByEducation.bachelor;
    }

    if (edu === "apprenticeship") {
      return jobOptionsByEducation.apprenticeship;
    }

    return jobOptionsByEducation[edu] || null;
  }, [currentStepId, storyState]);

  // Handle button press (question steps)
  function handleOptionSelect(optionId) {
    setStoryState((prev) => ({
      ...prev,
      [currentStepId]: optionId,
    }));

    const nextId = step.next?.(optionId);
    if (!nextId) return;

    setIsCardVisible(false);
    setCurrentStepId(nextId);

    setTimeout(() => {
      setIsCardVisible(true);
    }, 550);
  }

  // Handle info step "Continue"
  function handleContinue() {
    const nextId = step.next?.();
    if (!nextId) return;

    setIsCardVisible(false);
    setCurrentStepId(nextId);

    setTimeout(() => {
      setIsCardVisible(true);
    }, 550);
  }

  // Avatar style based on current step position
  const avatarStyle = useMemo(() => {
    const pos = avatarPositions[currentStepId] || { x: 50, y: 80 };
    return {
      left: `${pos.x}%`,
      top: `${pos.y}%`,
      transform: "translate(-50%, -50%)",
    };
  }, [currentStepId]);

  if (!step) return null;

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

      {/* Main content: static background + moving avatar + overlay card */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-6xl aspect-[16/9] bg-gray-100 rounded-2xl shadow-xl overflow-hidden border border-[#589eaf]/10">
          {/* Static 1920x1080 roadmap background */}
          <img
            src={roadmapBg}
            alt="Roadmap background"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Moving avatar */}
          <div
            className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#589eaf]/10 flex items-center justify-center shadow-lg transition-all duration-500 ease-out"
            style={avatarStyle}
          >
            <img
              src={avatarImg}
              alt="Story avatar"
              className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-full translate-y-1"
              style={{ objectPosition: "center 1%" }}
            />
          </div>

          {/* Story card overlay (only when visible) */}
          {isCardVisible && (
            <div className="absolute left-4 top-4 md:left-6 md:top-6 max-w-sm">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-5 border border-[#589eaf]/10">
                <h2 className="text-lg md:text-xl font-bold text-[#589eaf] mb-2">
                  {step.title}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mb-4">
                  {step.description}
                </p>

                {/* Choice steps */}
                {step.type !== "info" && (
                  <div className="grid gap-2 md:gap-3">
                    {(step.dynamic ? dynamicOptions : step.options)?.map(
                      (option) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id)}
                          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm text-left shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5"
                        >
                          {option.label}
                        </button>
                      )
                    )}
                  </div>
                )}

                {/* Info steps */}
                {step.type === "info" && (
                  <div className="mt-2 md:mt-4">
                    {step.next ? (
                      <button
                        onClick={handleContinue}
                        className="bg-[#589eaf] text-white rounded-xl px-4 py-2 text-xs md:text-sm font-medium shadow-sm hover:bg-[#4c8b99] transition"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/app/overview")}  // ⬅️ NEW
                        className="bg-[#94d260] text-white rounded-xl px-4 py-2 text-xs md:text-sm font-semibold shadow-sm hover:bg-[#7fb952] transition"
                      >
                        Finish
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Story;