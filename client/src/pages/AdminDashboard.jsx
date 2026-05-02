import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { deleteUserAPI, deleteQuoteAPI, getQuotesAPI, getAllUsersAPI } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: [], quotes: [] });
  const [loading, setLoading] = useState(true);
  const [quoteSort, setQuoteSort] = useState("recent"); // "recent" or "likes"
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      return;
    }
    try {
      const quotesData = await getQuotesAPI();
      const usersData = await getAllUsersAPI();
      setStats({ 
        users: usersData.users || [], 
        quotes: quotesData.quotes || []
      });
    } catch (error) {
      console.error("Error fetching admin stats", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action is permanent.")) {
      try {
        await deleteUserAPI(id);
        toast.success("User account purged");
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Purge failed");
      }
    }
  };

  const handleDeleteQuote = async (id) => {
    if (window.confirm("Delete this content from the platform?")) {
      try {
        await deleteQuoteAPI(id);
        toast.success("Content removed");
        fetchData();
      } catch (error) {
        toast.error("Moderation action failed");
      }
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchData();
    }
  }, []);

  // Calculate some analytics
  const topContributors = (stats.users || [])
    .map(u => ({
      ...u,
      quoteCount: (stats.quotes || []).filter(q => q.createdBy === u._id).length
    }))
    .sort((a, b) => b.quoteCount - a.quoteCount)
    .slice(0, 4);

  const totalLikes = (stats.quotes || []).reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);
  const avgEngagement = stats.quotes.length > 0 ? (totalLikes / stats.quotes.length).toFixed(1) : 0;

  if (!user || user.role !== "admin") {
    return <Login isAdminPage={true} />;
  }

  return (
    <div className="p-4 md:p-12 bg-[#fdfdfd] dark:bg-[#050505] min-h-screen text-black dark:text-white pt-24 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Minimal Clean Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 pb-6 border-b border-black/5 dark:border-white/5 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
              Admin <span className="text-indigo-600 dark:text-indigo-400">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Platform Oversight & Management</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: "Total Quotes", 
              value: stats.quotes.length, 
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
              color: "text-rose-500",
              bg: "bg-rose-500/5",
              action: () => {
                setQuoteSort("recent");
                document.getElementById("quotes-section").scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            },
            { 
              label: "Registered Users", 
              value: stats.users.length, 
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
              color: "text-indigo-500",
              bg: "bg-indigo-500/5",
              action: () => {
                document.getElementById("users-section").scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            },
            { 
              label: "Engagement", 
              value: totalLikes, 
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
              color: "text-pink-500",
              bg: "bg-pink-500/5",
              action: () => {
                setQuoteSort("likes");
                document.getElementById("quotes-section").scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            },
            { 
              label: "Avg. Likes", 
              value: avgEngagement, 
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
              color: "text-emerald-500",
              bg: "bg-emerald-500/5",
              action: () => {
                setQuoteSort("likes");
                document.getElementById("quotes-section").scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            },
          ].map((stat, i) => (
            <div 
              key={i} 
              onClick={stat.action}
              className="group bg-white dark:bg-[#0a0a0a] p-6 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {stat.icon}
                  </svg>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                </div>
              </div>
              <p className="text-4xl font-black tracking-tighter text-black dark:text-white">
                {loading ? "..." : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8 mb-12">
          {/* Main User Table */}
          <div id="users-section" className="w-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden scroll-mt-24">
            <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-gray-50/30 dark:bg-white/[0.01]">
              <h2 className="text-2xl font-black tracking-tight">User Directory</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Database</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] bg-gray-50/50 dark:bg-white/[0.02]">
                    <th className="px-8 py-5">Member</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {(stats.users || []).map((u) => (
                    <tr key={u._id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                            {u.profilePic ? (
                              <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-rose-500 font-black text-xl">{u.name[0]}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-sm truncate">{u.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${
                            u.role === "admin" 
                              ? "bg-rose-500/5 text-rose-500 border-rose-500/20" 
                              : "bg-gray-100 dark:bg-white/5 text-gray-500 border-black/5 dark:border-white/10"
                          }`}>
                            {u.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {u._id !== user.id && (
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="w-10 h-10 ml-auto rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all group/btn shadow-sm active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Bottom Panel: Top Contributors */}
          <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl font-black tracking-tight mb-8">Top Contributors</h2>
            <div className="space-y-6 flex-grow">
              {topContributors.map((top, i) => (
                <div key={i} className="flex items-center justify-between group p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-500/5 flex items-center justify-center font-black text-rose-500 shrink-0 shadow-sm">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black truncate leading-tight mb-0.5">{top.name}</p>
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-md ${
                        top.role === 'admin' 
                          ? 'bg-rose-500/10 text-rose-500' 
                          : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                      }`}>
                        {top.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <p className="text-lg font-black text-rose-500 leading-none">{top.quoteCount}</p>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-1">Quotes</p>
                  </div>
                </div>
              ))}
              {topContributors.length === 0 && (
                <p className="text-center text-gray-500 font-bold italic py-10">Waiting for data...</p>
              )}
            </div>
            
          </div>
        </div>

        {/* Recent Quotes Management */}
        <div id="quotes-section" className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden mb-12 scroll-mt-24">
          <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              {quoteSort === "likes" ? "Top Performing Quotes" : "Recent Activity Stream"}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setQuoteSort("recent")}
                className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${quoteSort === "recent" ? "bg-rose-500 text-white border-rose-500" : "bg-gray-100 dark:bg-white/5 text-gray-500 border-black/5 dark:border-white/10"}`}
              >
                Recent
              </button>
              <button 
                onClick={() => setQuoteSort("likes")}
                className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${quoteSort === "likes" ? "bg-rose-500 text-white border-rose-500" : "bg-gray-100 dark:bg-white/5 text-gray-500 border-black/5 dark:border-white/10"}`}
              >
                Top Liked
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="px-8 py-5">Quote Stream</th>
                  <th className="px-8 py-5">Original Author</th>
                  <th className="px-8 py-5 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {[...(stats.quotes || [])]
                  .sort((a, b) => quoteSort === "likes" ? (b.likes?.length || 0) - (a.likes?.length || 0) : 0)
                  .slice(0, 8)
                  .map((q) => (
                  <tr key={q._id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6">
                      <div className="max-w-xl">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 italic leading-relaxed">
                          "{q.text}"
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-rose-500/80 bg-rose-500/5 px-3 py-1 rounded-lg">
                        {q.author}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleDeleteQuote(q._id)}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Delete Content"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center py-12">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
            QuotePost Administration v1.0.0 • Production Ready
          </p>
        </div>
      </div>
    </div>
  );
}

