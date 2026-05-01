import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutAPI, updateProfileAPI } from "../services/api";
import toast from "react-hot-toast";

export default function Navbar({ theme, toggleTheme }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAPI();
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);
      
      try {
        const res = await updateProfileAPI(formData);
        localStorage.setItem("user", JSON.stringify({ ...user, profilePic: res.user.profilePic }));
        toast.success("Profile photo updated!");
        window.location.reload();
      } catch (error) {
        toast.error("Upload failed");
      }
    }
  };

  const navLinks = [
    { name: "Home", path: "/?filter=all" },
    { name: "Search", path: "/?filter=search" },
    { name: "Post", path: "/?filter=post" },
    { name: "Likes", path: "/?filter=likes" },
    { name: "Profile", path: "/?filter=profile" },
  ];

  return (
    <nav className="bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-xl text-black dark:text-white py-4 px-6 md:px-12 flex justify-between items-center border-b border-black/5 dark:border-white/10 sticky top-0 z-50 shadow-xl transition-colors duration-300">
      {/* Left: Logo & Mobile Toggle */}
      <div className="flex items-center gap-4">
        {location.pathname !== "/admin" && (
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-rose-500/10 transition-all"
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        )}
        
        <Link 
          to="/" 
          className="group flex items-center gap-2 text-2xl font-black tracking-tighter shrink-0"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-rose-600 to-pink-600 rounded-lg flex items-center justify-center text-sm transform group-hover:rotate-12 transition-transform text-white">
            {location.pathname === "/admin" ? "A" : "Q"}
          </div>
          <span className="bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent hidden sm:block">
            {location.pathname === "/admin" ? "AdminPanel" : "QuotePost"}
          </span>
        </Link>
      </div>
      
      {/* Center: Nav Links - Desktop */}
      {location.pathname !== "/admin" && (
        <div className="hidden lg:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`text-base font-semibold transition-all hover:text-rose-500 relative group/link ${
                (location.pathname + location.search === link.path || (location.pathname === "/" && location.search === "" && link.name === "Home")) ? "text-rose-500" : "text-gray-500 dark:text-gray-300"
              }`}
            >
              {link.name}
              {(location.pathname + location.search === link.path || (location.pathname === "/" && location.search === "" && link.name === "Home")) && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && location.pathname !== "/admin" && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0f0f0f] border-b border-black/5 dark:border-white/10 lg:hidden py-4 px-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top duration-300 z-40">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-bold transition-all p-3 rounded-xl flex items-center justify-between ${
                (location.pathname + location.search === link.path || (location.pathname === "/" && location.search === "" && link.name === "Home")) ? "bg-rose-500/10 text-rose-500" : "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              {link.name}
              {(location.pathname + location.search === link.path || (location.pathname === "/" && location.search === "" && link.name === "Home")) && (
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Right: User/Auth Actions */}
      <div className="flex gap-4 items-center shrink-0">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-400"
        >
          {theme === "dark" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex flex-col items-end hidden xs:flex">
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                {user.role === "admin" ? (
                  <>
                    <span className="text-rose-500">Administrator</span>
                    <Link to="/admin" className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white rounded text-[7px] hover:bg-rose-600 transition-colors">DASHBOARD</Link>
                  </>
                ) : "Member"}
              </span>
              <span className="text-xs md:text-sm font-bold text-black dark:text-white">
                {user.name}
              </span>
            </div>
            
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                id="profile-upload" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="profile-upload" className="cursor-pointer block">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/5 dark:border-white/10 overflow-hidden group-hover:border-rose-500 transition-all">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-rose-500 font-bold">
                      {user.name?.[0]}
                    </div>
                  )}
                </div>
              </label>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-rose-900/20"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors px-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-xs font-black transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 shadow-lg"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}