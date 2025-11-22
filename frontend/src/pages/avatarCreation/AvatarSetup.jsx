import { useNavigate } from "react-router-dom";

function AvatarSetup() {
  const navigate = useNavigate();

  const handleNext = () => {
    // später: Validierung / Daten speichern
    navigate("/avatar/questions");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Avatar erstellen</h2>
      <p className="text-sm text-slate-600 mb-4">
        Hier definierst du Basisdaten wie Name, Alter, Einkommen, Ersparnisse usw.
      </p>

      {/* Platzhalter-Formular */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="z. B. Alex"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Alter</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="z. B. 28"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm"
        >
          Weiter zu den Fragen
        </button>
      </div>
    </div>
  );
}

export default AvatarSetup;