import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password/${token}`, { password });
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm border border-black/5 dark:border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-rose-500">New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500 dark:text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all text-black dark:text-white"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-500 dark:text-gray-400 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all text-black dark:text-white"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-rose-900/20 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
