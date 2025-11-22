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
    <aside className="w-72 min-h-screen bg-[#589eaf] text-white flex flex-col px-5 py-6 shadow-lg relative">

      {/* Desktop fixed header+nav overlay (keeps logo/menu visible) */}
      <div className="hidden md:block fixed left-6 top-6 w-60 z-40">
        <div className="bg-transparent">
          <div className="h-10 w-10 rounded-2xl bg-white/90 flex items-center justify-center overflow-hidden shadow-sm mb-3">
            <img src={logo} alt="HomeReady logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-lg font-semibold leading-tight">HomeReady</span>
            <span className="text-[11px] text-sky-50/80">by Interhyp Gruppe</span>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <NavLink to="/app/story" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
              <span className="h-2 w-2 rounded-full bg-[#94d260]" />
              <span>Story</span>
            </NavLink>
            <NavLink to="/app/overview" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
              <span className="h-2 w-2 rounded-full bg-white/70" />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/app/knowledge" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
              <span className="h-2 w-2 rounded-full bg-white/70" />
              <span>Knowledge</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Mobile / default header + nav (visible when not using the fixed overlay) */}
      <div className="md:hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-white/90 flex items-center justify-center overflow-hidden shadow-sm">
            <img src={logo} alt="HomeReady logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight">HomeReady</span>
            <span className="text-[11px] text-sky-50/80">by Interhyp Gruppe</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-sm mb-4">
          <NavLink to="/app/story" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            <span className="h-2 w-2 rounded-full bg-[#94d260]" />
            <span>Story</span>
          </NavLink>
          <NavLink to="/app/overview" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            <span className="h-2 w-2 rounded-full bg-white/70" />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/app/knowledge" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            <span className="h-2 w-2 rounded-full bg-white/70" />
            <span>Knowledge</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom actions: sticky on desktop, floating fixed bar on mobile */}
      <div className="mt-auto pt-6 text-xs">
        {/* Desktop / large screens: keep in the sidebar and stick to bottom */}
        {/* Desktop: fixed so actions stay visible even when content scrolls */}
        <div className="hidden md:block fixed left-6 bottom-6 w-60">
          <button
            onClick={() => navigate("/avatar")}
            className="w-full text-left px-3 py-2 rounded-xl bg-white/10 text-sky-50/90 hover:bg-white/15 transition"
            aria-label="Create new avatar"
          >
            Create new avatar
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-2 text-left px-3 py-2 rounded-xl text-red-100 hover:bg-white/10 hover:text-red-50 transition"
            aria-label="Log out"
          >
            Log out
          </button>
        </div>

        {/* Mobile: floating bottom bar so actions stay in view */}
        <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 flex gap-2 bg-[#589eaf] p-2 rounded-xl z-50 shadow-lg">
          <button
            onClick={() => navigate("/avatar")}
            className="flex-1 text-sm px-3 py-2 rounded bg-white/90 text-[#075985] font-medium"
            aria-label="Create new avatar mobile"
          >
            New avatar
          </button>
          <button
            onClick={handleLogout}
            className="flex-none text-sm px-3 py-2 rounded bg-white/10 text-white"
            aria-label="Log out mobile"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;