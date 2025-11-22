// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo_temp.png"; // adjust path if needed

function Sidebar() {
  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition";
  const inactive =
    "text-sky-50/80 hover:bg-white/10";
  const active =
    "bg-white text-[#589eaf] shadow-sm";

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isNewUser");
    localStorage.removeItem("user");
    localStorage.removeItem("avatars");

    localStorage.removeItem("storyState");
  localStorage.removeItem("storyCurrentStepId");


    navigate("/login", { replace: true });
  }

  return (
    <aside className="w-72 min-h-screen bg-[#589eaf] text-white flex flex-col px-5 py-6 shadow-lg">
      {/* Header with logo + title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-white/90 flex items-center justify-center overflow-hidden shadow-sm">
          <img
            src={logo}
            alt="HomeReady logo"
            className="h-8 w-8 object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-tight">
            HomeReady
          </span>
          <span className="text-[11px] text-sky-50/80">
            by Interhyp Gruppe
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm">
        <NavLink
          to="/app/story"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <span className="h-2 w-2 rounded-full bg-[#94d260]" />
          <span>Story</span>
        </NavLink>

        <NavLink
          to="/app/overview"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <span className="h-2 w-2 rounded-full bg-white/70" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/app/knowledge"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <span className="h-2 w-2 rounded-full bg-white/70" />
          <span>Knowledge</span>
        </NavLink>
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto pt-6 flex flex-col gap-2 text-xs">
        <button
          onClick={() => navigate("/avatar")}
          className="text-left px-3 py-2 rounded-xl bg-white/10 text-sky-50/90 hover:bg-white/15 transition"
        >
          Create new avatar
        </button>

        <button
          onClick={handleLogout}
          className="text-left px-3 py-2 rounded-xl text-red-100 hover:bg-white/10 hover:text-red-50 transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;