import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Overview() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(() => {
    return localStorage.getItem("activeAvatarId") || null;
  });
  async function loadAvatars() {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let list = [];
      if (token) {
        // use absolute backend URL to avoid dev-server proxy issues
        const res = await fetch("http://localhost:3000/api/avatars/listAvatar", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          try {
            const body = await res.json();
            list = body;
          } catch (err) {
            console.error("Invalid JSON from avatars endpoint", err);
            // fallback to localStorage
            const stored = localStorage.getItem("avatars");
            list = stored ? JSON.parse(stored) : [];
          }
        } else {
          console.warn("Avatars endpoint responded with", res.status);
          const stored = localStorage.getItem("avatars");
          list = stored ? JSON.parse(stored) : [];
        }
      } else {
        const stored = localStorage.getItem("avatars");
        list = stored ? JSON.parse(stored) : [];
      }
      setAvatars(list || []);
      // if no active avatar, pick first
      if (!activeId && list && list.length) {
        setActiveId(String(list[0].id));
        localStorage.setItem("activeAvatarId", String(list[0].id));
      }
    } catch (err) {
      console.error("Failed to load avatars", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvatars();
  }, []);

  function handleSelectAvatar(id) {
    setActiveId(String(id));
    localStorage.setItem("activeAvatarId", String(id));
  }

  function handleCreateAvatar() {
    navigate("/avatar");
  }

  // story progress from localStorage
  const storyState = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("storyState") || "{}");
    } catch (e) {
      return {};
    }
  }, []);

  const storyStepId = localStorage.getItem("storyCurrentStepId") || null;

  const storyProgress = useMemo(() => {
    const filled = Object.values(storyState).filter(Boolean).length;
    const total = Math.max(Object.keys(storyState).length, 6); // fallback to 6 steps
    return Math.round((filled / total) * 100);
  }, [storyState]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-sm text-slate-600">Your avatars, story progress and attributes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCreateAvatar} className="bg-[#589eaf] text-white px-4 py-2 rounded-xl">Create avatar</button>
          <button onClick={loadAvatars} className="border border-gray-200 px-3 py-2 rounded-lg text-sm">Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Avatars</h3>
            {loading && <div className="text-sm text-slate-500">Loading avatars…</div>}
            {!loading && avatars.length === 0 && (
              <div className="text-sm text-slate-500">No avatars yet. Create one to get started.</div>
            )}

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {avatars.map((a) => (
                <div key={a.id} className={`p-3 rounded-xl border ${String(a.id) === String(activeId) ? 'border-[#589eaf] bg-[#f0fbfd]' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-slate-500">{a.gender || '—'} • {a.age ? `${a.age} yrs` : '—'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSelectAvatar(a.id)} className="text-sm px-3 py-1 rounded bg-[#589eaf] text-white">Use</button>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-600 grid grid-cols-2 gap-2">
                    <div><strong>Occupation:</strong> {a.occupation || '—'}</div>
                    <div><strong>Education:</strong> {a.education || a.education_level || '—'}</div>
                    <div><strong>Income:</strong> {a.income ?? '—'}</div>
                    <div><strong>Savings:</strong> {a.savings ?? '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Story Progress</h3>
            <div className="text-sm text-slate-600 mb-3">Current step: <span className="font-medium text-slate-700">{storyStepId || 'Not started'}</span></div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-3">
              <div className="h-3 bg-emerald-600" style={{ width: `${storyProgress}%` }} />
            </div>
            <div className="text-xs text-slate-500 mb-4">{storyProgress}% completed</div>

            <h4 className="text-sm font-medium mb-2">Active avatar</h4>
            {activeId ? (
              (() => {
                const a = avatars.find((x) => String(x.id) === String(activeId));
                if (!a) return <div className="text-sm text-slate-500">Selected avatar not found.</div>;
                return (
                  <div className="text-sm text-slate-700">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-slate-500">{a.gender || '—'} • {a.age ? `${a.age} yrs` : '—'}</div>
                    <div className="mt-2 text-xs text-slate-600">
                      <div><strong>Occupation:</strong> {a.occupation || '—'}</div>
                      <div><strong>Education:</strong> {a.education || a.education_level || '—'}</div>
                      <div><strong>Income:</strong> {a.income ?? '—'}</div>
                      <div><strong>Savings:</strong> {a.savings ?? '—'}</div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-sm text-slate-500">No avatar selected</div>
            )}

            <div className="mt-4">
              <button onClick={() => navigate('/app/story')} className="w-full bg-[#589eaf] text-white rounded-xl px-4 py-2">Go to Story</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Overview;