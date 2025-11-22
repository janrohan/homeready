import { useNavigate } from "react-router-dom";

function OnboardingQuestions() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/avatar");
  };

  const handleNext = () => {
    // später: Antworten speichern
    navigate("/avatar/house");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Fragen zu deinem Profil</h2>
      <p className="text-sm text-slate-600 mb-4">
        Hier kommen Fragen zu Lebensstil, Sparverhalten und Risiko.
      </p>

      {/* Platzhalter-Fragen */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">
            Wie würdest du dein Sparverhalten beschreiben?
          </label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm">
            <option>Ich spare regelmäßig</option>
            <option>Ich spare unregelmäßig</option>
            <option>Ich spare kaum</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleBack}
          className="border border-slate-300 text-slate-700 rounded-lg px-4 py-2 text-sm"
        >
          Zurück
        </button>
        <button
          onClick={handleNext}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
        >
          Weiter zur Immobilien-Auswahl
        </button>
      </div>
    </div>
  );
}

export default OnboardingQuestions;