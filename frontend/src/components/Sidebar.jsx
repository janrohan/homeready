import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const linkBase =
    "block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100";
  const active =
    "bg-slate-900 text-white hover:bg-slate-900";

  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">HomeReady</h1>
        <p className="text-xs text-slate-500">
          Dein Weg zur eigenen Immobilie
        </p>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        <NavLink
          to="/app/story"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : "text-slate-700"}`
          }
        >
          Story
        </NavLink>
        <NavLink
          to="/app/overview"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : "text-slate-700"}`
          }
        >
          Übersicht
        </NavLink>
        <NavLink
          to="/app/knowledge"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : "text-slate-700"}`
          }
        >
          Begriffe
        </NavLink>
      </nav>

      <button
        onClick={() => navigate("/avatar")}
        className="mt-auto text-xs text-slate-600 underline text-left pt-4"
      >
        Neuen Avatar erstellen
      </button>
    </aside>
  );
}

export default Sidebar;