import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerAPI({ name, email, password });
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm border border-black/5 dark:border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-rose-500">Create Account</h2>
        <form onSubmit={handleRegister} autoComplete="off">
          <div className="mb-4">
            <label className="block text-gray-500 dark:text-gray-400 mb-2">Name</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all text-black dark:text-white"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 dark:text-gray-400 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all text-black dark:text-white"
              autoComplete="none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-500 dark:text-gray-400 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all text-black dark:text-white"
              autoComplete="new-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={64}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$"
              title="Password must contain at least one uppercase, one lowercase, one number and one special character"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-500 hover:text-rose-500 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-rose-900/20">
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
