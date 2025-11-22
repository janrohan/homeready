import { useNavigate } from "react-router-dom";

function HouseSelection() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/avatar/questions");
  };

  const handleFinish = () => {
    // später: gewählte Immobilie speichern
    navigate("/app/story");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Immobilie auswählen</h2>
      <p className="text-sm text-slate-600 mb-4">
        Wähle eine Immobilie, die als Ziel für deine Journey dienen soll.
      </p>

      {/* Platzhalter-Immobilienliste */}
      <div className="grid gap-3">
        <button className="text-left border rounded-lg p-3 text-sm hover:bg-slate-50">
          2-Zimmer Wohnung in München – 450.000 €
        </button>
        <button className="text-left border rounded-lg p-3 text-sm hover:bg-slate-50">
          3-Zimmer Wohnung in Augsburg – 320.000 €
        </button>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleBack}
          className="border border-slate-300 text-slate-700 rounded-lg px-4 py-2 text-sm"
        >
          Zurück
        </button>
        <button
          onClick={handleFinish}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
        >
          Onboarding abschließen
        </button>
      </div>
    </div>
  );
}

export default HouseSelection;