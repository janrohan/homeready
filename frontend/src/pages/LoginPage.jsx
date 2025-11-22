function LoginPage() {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <p className="text-sm text-slate-600 mb-4">
          Hier kommt später das echte Login-Formular hin.
        </p>
        {/* Platzhalter-Formular */}
        <form className="space-y-3">
          <div>
            <label className="block text-sm mb-1">E-Mail</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="du@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Passwort</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            className="w-full mt-2 bg-slate-900 text-white rounded-lg py-2 text-sm"
          >
            Einloggen
          </button>
        </form>
      </div>
    );
  }
  
  export default LoginPage;