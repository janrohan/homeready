// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");       // optional in your DB
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email: email || null,
          password,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody.message || "Registration failed";
        throw new Error(message);
      }

      const data = await res.json();
      // Expecting something like: { token, user, isNewUser }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("isNewUser", String(data.isNewUser ?? true));
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      // Optional: avatars if backend returns them
      if (data.avatars) {
        localStorage.setItem("avatars", JSON.stringify(data.avatars));
      }

      // After registration, go straight to onboarding (or story)
      if (data.isNewUser ?? true) {
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
      <h2 className="text-3xl font-bold mb-4 text-[#589eaf]">
        Create your account
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Start your journey towards owning a home.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#589eaf] transition"
            placeholder="choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#589eaf] transition"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#589eaf] transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
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
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-600 text-center">
        Already have an account?{" "}
        <button
          type="button"
          className="text-[#589eaf] underline"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </p>
    </div>
  );
}

export default RegisterPage;