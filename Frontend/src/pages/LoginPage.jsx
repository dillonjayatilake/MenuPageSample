import { useState } from "react";
import axios from "../api/axios";

export default function LoginPage({ onLoginSuccess, onBackClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/login", {
        email,
        password
      });

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Call the callback to navigate to ChefDashboard
      onLoginSuccess(res.data.user);
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ccb06a" }}>
      <div className="max-w-md mx-auto bg-amber-50 rounded-lg shadow-lg p-8 border-2 border-stone-700">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-stone-800 font-serif">Staff Login</h1>
          <p className="text-stone-600 mt-2">Chef & Admin Access Only</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-stone-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-stone-400 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-stone-400 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-stone-800 hover:bg-stone-900 disabled:bg-stone-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {onBackClick && (
            <button
              onClick={onBackClick}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="mt-6 p-3 bg-stone-100 rounded-lg text-xs text-stone-600">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Chef: <span className="font-mono">chef@test.com</span> / <span className="font-mono">123456</span></p>
          <p>Admin: <span className="font-mono">admin@test.com</span> / <span className="font-mono">123456</span></p>
        </div>
      </div>
    </div>
  );
}