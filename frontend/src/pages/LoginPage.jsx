// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // You can send email separately too, but identifier is enough for now
        body: JSON.stringify({
          identifier,
          password,
          email: identifier, // optional, useful if identifier is an email for new users
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody.message || "Login failed";
        throw new Error(message);
      }

      const data = await res.json();
      // Expecting: { token, user, isNewUser, avatars }

      // Store what we need in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("isNewUser", String(data.isNewUser));
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      // optional: store avatars
      if (data.avatars) {
        localStorage.setItem("avatars", JSON.stringify(data.avatars));
      }

      // Navigate based on isNewUser
      if (data.isNewUser) {
        navigate("/avatar", { replace: true });
      } else {
        navigate("/app/story", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-3xl font-bold mb-4 text-[#589eaf]">Welcome back</h2>
      <p className="text-sm text-gray-600 mb-6">
        Log in to continue your home ownership journey.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Email or username
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#589eaf] transition"
            placeholder="you@example.com or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#589eaf] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#589eaf] text-white rounded-xl py-2.5 text-sm font-medium shadow-sm hover:bg-[#4c8b99] transition disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-600 text-center">
        Don't have an account yet?{" "}
        <button
          type="button"
          className="text-[#589eaf] underline"
          onClick={() => navigate("/register")}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default LoginPage;