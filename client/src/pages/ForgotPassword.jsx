import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/forgot-password`, { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm border border-black/5 dark:border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-rose-500">Reset Password</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-500 dark:text-gray-400 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all text-black dark:text-white"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-rose-900/20 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <Link to="/login" className="text-rose-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
