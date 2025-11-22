// src/layout/AuthLayout.jsx
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;