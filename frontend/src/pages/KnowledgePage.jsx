import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


function KnowledgeBlock({ id, title, children, learned, onToggleLearned, quiz }) {
  const [open, setOpen] = useState(true);

  return (
    <section id={id} className="mb-8 border-b pb-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="text-sm text-slate-700">{children}</div>
        </div>

        <div className="ml-4 flex flex-col items-end gap-2">
          <button
            onClick={() => setOpen((s) => !s)}
            className="text-xs px-3 py-1 rounded-md border text-slate-600 hover:bg-slate-50"
          >
            {open ? "Collapse" : "Expand"}
          </button>

          <button
            onClick={onToggleLearned}
            className={`text-xs px-3 py-1 rounded-md ${learned ? "bg-emerald-600 text-white" : "border text-slate-600 hover:bg-slate-50"}`}
          >
            {learned ? "Learned ✓" : "Mark as learned"}
          </button>
        </div>
      </div>

      {open && quiz}
    </section>
  );
}

function QuizInline({ q, onComplete, completed }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (completed) setResult(true);
  }, [completed]);

  function check() {
    const ok = String(answer).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
    setResult(ok);
    if (ok) onComplete();
  }

  return (
    <div className="mt-4">
      <div className="text-sm font-medium mb-2">Quick quiz: {q.question}</div>
      <div className="flex gap-2">
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} className="flex-1 border rounded px-3 py-2 text-sm" />
        <button onClick={check} className="px-4 py-2 bg-slate-900 text-white rounded text-sm">Check</button>
      </div>
      {result === true && <div className="mt-2 text-sm text-emerald-700">Correct!</div>}
      {result === false && <div className="mt-2 text-sm text-rose-600">Try again.</div>}
    </div>
  );
}

const TERMS = [
  { id: "mortgage", title: "What is a mortgage?", text: `A mortgage is a loan used to purchase a home or property. It is secured by the property itself and usually repaid over a long period (for example, 15 or 30 years). Monthly payments typically include interest and a portion that reduces the loan principal.`, quiz: { question: "What is the loan called that's secured by the property?", answer: "mortgage" } },
  { id: "interest", title: "Interest Rate", text: `The interest rate is the percentage charged by the lender on the outstanding loan balance. Rates can be fixed (unchanged for an agreed period) or variable (changing with market rates). A lower rate reduces the total cost of borrowing.`, quiz: { question: "Does a lower interest rate increase or decrease the total cost of borrowing?", answer: "decrease" } },
  { id: "downpayment", title: "Down Payment", text: `The down payment is the upfront amount you pay when buying a property, usually expressed as a percentage of the purchase price. A larger down payment reduces the financed amount and may improve loan terms.`, quiz: { question: "Does a larger down payment increase or decrease the financed amount?", answer: "decrease" } },
  { id: "amortization", title: "Amortization", text: `Amortization describes how a loan is paid down over time through regular payments. Early payments often consist mostly of interest; over time the principal portion grows.`, quiz: { question: "Do early payments generally contain more principal or more interest?", answer: "interest" } },
  { id: "ltv", title: "Loan-to-Value (LTV)", text: `The Loan-to-Value ratio compares the loan amount to the property's value (loan ÷ value). It is expressed as a percentage and helps lenders assess risk — a lower LTV is generally safer for the lender and may result in better terms for the borrower.`, quiz: { question: "Is a lower LTV safer for the lender?", answer: "yes" } },
  { id: "apr", title: "APR (Annual Percentage Rate)", text: `APR represents the total yearly cost of borrowing, including the interest rate and certain fees expressed as an annual percentage. APR helps compare offers with different fee structures.`, quiz: { question: "Does APR include fees in addition to the interest rate?", answer: "yes" } },
  { id: "principal", title: "Principal", text: `The principal is the outstanding loan amount (excluding interest). Monthly payments reduce the principal over time according to the amortization schedule.`, quiz: { question: "What is the term for the outstanding loan amount excluding interest?", answer: "principal" } },
  { id: "equity", title: "Equity", text: `Equity is the portion of the property's value that you truly own — calculated as the property value minus outstanding mortgage balance. Equity grows when the property value rises or the mortgage principal is paid down.`, quiz: { question: "Is equity equal to property value minus mortgage balance?", answer: "yes" } },
  { id: "insurance", title: "Mortgage Insurance", text: `Mortgage insurance (for example PMI) protects the lender if a borrower defaults. It is often required when the down payment is small (high LTV). Mortgage insurance can be cancellable once equity reaches a certain threshold.`, quiz: { question: "Mortgage insurance primarily protects the lender. True or False?", answer: "true" } },
  { id: "escrow", title: "Escrow Account", text: `An escrow account is held by the lender to pay recurring property-related costs like property taxes and homeowners insurance. Borrowers make monthly escrow payments that the lender then pays on their behalf when those bills are due.`, quiz: { question: "Is an escrow account used to pay property taxes and insurance?", answer: "yes" } },
  { id: "term", title: "Mortgage Term", text: `The mortgage term is the length of time over which the loan must be repaid (e.g. 15, 20, or 30 years). Shorter terms generally mean higher monthly payments but lower overall interest paid.`, quiz: { question: "Do shorter terms generally result in lower total interest paid?", answer: "yes" } },
  { id: "prepayment", title: "Prepayment", text: `Prepayment refers to paying off part or all of the mortgage ahead of schedule. Some loans include prepayment penalties; others allow extra payments without penalty.`, quiz: { question: "Can some loans charge a penalty for prepayment?", answer: "yes" } },
];

function KnowledgePage() {
  const navigate = useNavigate();
  const [learnedMap, setLearnedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("knowledge_learned") || "{}");
    } catch (e) {
      return {};
    }
  });
  const [quizCompleted, setQuizCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("knowledge_quiz") || "{}");
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("knowledge_learned", JSON.stringify(learnedMap));
  }, [learnedMap]);

  useEffect(() => {
    localStorage.setItem("knowledge_quiz", JSON.stringify(quizCompleted));
  }, [quizCompleted]);

  const total = TERMS.length;
  const learnedCount = Object.values(learnedMap).filter(Boolean).length;
  const quizzesDone = Object.values(quizCompleted).filter(Boolean).length;
  const progress = Math.round((learnedCount / total) * 100);

  function toggleLearned(id) {
    setLearnedMap((m) => ({ ...m, [id]: !m[id] }));
  }

  function completeQuiz(id) {
    setQuizCompleted((m) => ({ ...m, [id]: true }));
    // auto-mark learned when quiz passed
    setLearnedMap((m) => ({ ...m, [id]: true }));
  }

  const badges = useMemo(() => {
    // Only award the master badge when all quizzes are completed correctly.
    // This avoids awarding badges prematurely when individual questions are answered.
    const list = [];
    if (quizzesDone === total && total > 0) {
      list.push({ id: "master", label: "Knowledge Master" });
    }
    return list;
  }, [progress, quizzesDone, learnedCount]);

  // confetti: create simple DOM particles in the overlay
  const confettiRootId = "confetti-root";
  const runningRef = useRef(false);

  function launchConfetti(amount = 48) {
    if (runningRef.current) return; // avoid overlapping bursts
    runningRef.current = true;
    const root = document.getElementById(confettiRootId);
    if (!root) {
      runningRef.current = false;
      return;
    }
    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
    const pieces = [];
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    for (let i = 0; i < amount; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      const size = Math.floor(Math.random() * 14) + 8; // 8 - 22px
      el.style.position = "fixed";
      // spawn across the width, prefer center
      const left = 20 + Math.random() * 60; // percent
      el.style.left = `${left}vw`;
      // start slightly above fold
      el.style.top = `${10 + Math.random() * 10}vh`;
      // shapes: rectangles or circles
      if (Math.random() > 0.6) {
        el.style.borderRadius = "50%";
      } else if (Math.random() > 0.3) {
        el.style.borderRadius = "6px";
      } else {
        el.style.borderRadius = "2px";
      }
      el.style.width = `${size}px`;
      el.style.height = `${Math.floor(size * (0.6 + Math.random() * 1.4))}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = "1";
      el.style.zIndex = "9999";
      el.style.transform = `translate3d(0,0,0) rotate(${Math.random() * 360}deg)`;
      // randomized duration and easing
      const dur = 900 + Math.random() * 800; // 900 - 1700ms
      el.style.transition = `transform ${dur}ms cubic-bezier(.2,.8,.2,1), opacity ${dur + 100}ms linear`;
      root.appendChild(el);
      pieces.push(el);

      // trigger animation shortly after insert
      setTimeout(() => {
        const driftX = (Math.random() - 0.5) * (vw * 0.6); // px
        const fallY = window.innerHeight * (0.6 + Math.random() * 0.4);
        const rotate = (Math.random() - 0.5) * 1440;
        el.style.transform = `translate3d(${driftX}px, ${fallY}px, 0) rotate(${rotate}deg)`;
        el.style.opacity = "0";
      }, 20 + Math.random() * 200);
    }

    // cleanup
    setTimeout(() => {
      pieces.forEach((p) => p.remove());
      runningRef.current = false;
    }, 2200 + amount * 30);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-6 bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-bold mb-3">Learning Progress</h2>
            <div className="mb-3">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
                <div>{learnedCount}/{total} terms</div>
                <div className="font-medium">{progress}%</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Badges</div>
              <div className="flex flex-wrap gap-2">
                {badges.length === 0 && <div className="text-xs text-slate-500">No badges yet</div>}
                {badges.map((b) => (
                  <div key={b.id} className="px-2 py-1 bg-yellow-100 text-xs rounded">{b.label}</div>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">Quizzes passed: {quizzesDone}</div>
          </div>
        </aside>

        <main className="flex-1">
          {/* confetti overlay container */}
          <div id="confetti-root" className="pointer-events-none fixed inset-0 z-50" />

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Knowledge — Learn & Play</h1>
              <p className="text-sm text-slate-600">Interactive explanations, quick quizzes, and badges to make learning fun.</p>
            </div>
            <div>
              <button onClick={() => { localStorage.removeItem('knowledge_learned'); localStorage.removeItem('knowledge_quiz'); setLearnedMap({}); setQuizCompleted({}); }} className="text-sm text-slate-500 hover:underline">Reset progress</button>
            </div>
          </div>

          {TERMS.map((t) => (
            <KnowledgeBlock
              key={t.id}
              id={t.id}
              title={t.title}
              learned={!!learnedMap[t.id]}
              onToggleLearned={() => toggleLearned(t.id)}
              quiz={<QuizInline q={t.quiz} onComplete={() => { completeQuiz(t.id); launchConfetti(); }} completed={!!quizCompleted[t.id]} />}
            >
              <p>{t.text}</p>
            </KnowledgeBlock>
          ))}

          <footer className="mt-6 text-sm text-slate-600">
            <p>
              Keep going — earn badges by completing quizzes and marking terms as learned. These
              progress markers are stored locally in your browser.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default KnowledgePage;