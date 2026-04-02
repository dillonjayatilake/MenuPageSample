import { useState } from "react";
import axios from "../api/axios";

export default function SignupPage({ onSignupSuccess, onBackClick }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "chef"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      });

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Account created successfully! 🎉");
      onSignupSuccess(res.data.user);
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ccb06a" }}>
      <div className="max-w-md mx-auto bg-amber-50 rounded-lg shadow-lg p-8 border-2 border-stone-700">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✍️</div>
          <h1 className="text-3xl font-bold text-stone-800 font-serif">Create Account</h1>
          <p className="text-stone-600 mt-2">Register as Chef or Admin</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-stone-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-stone-400 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-stone-400 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone-400 rounded-lg focus:outline-none focus:border-amber-600"
            >
              <option value="chef">Chef 👨‍🍳</option>
              <option value="admin">Admin 👤</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-stone-400 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-stone-400 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-stone-800 hover:bg-stone-900 disabled:bg-stone-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {onBackClick && (
            <button
              onClick={onBackClick}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              ← Back to Login
            </button>
          )}
        </div>

        <div className="mt-6 p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
          <p className="font-semibold">📝 Requirements:</p>
          <ul className="text-xs mt-2 space-y-1">
            <li>✓ Password must be 6+ characters</li>
            <li>✓ Passwords must match</li>
            <li>✓ Role: Chef or Admin only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
