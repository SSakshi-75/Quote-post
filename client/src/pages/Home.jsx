import { useEffect, useState } from "react";
import QuoteCard from "../components/QuoteCard";
import QuoteForm from "../components/QuoteForm";
import {
  getQuotesAPI,
  likeQuoteAPI,
  createQuoteAPI,
  deleteQuoteAPI,
  updateQuoteAPI,
} from "../services/api";
import toast from "react-hot-toast";
import { useSearchParams, Link } from "react-router-dom";

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";
  const user = JSON.parse(localStorage.getItem("user"));

  const loadQuotes = async () => {
    try {
      const data = await getQuotesAPI();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error("Error loading quotes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const filteredQuotes = (quotes || []).filter((q) => {
    const matchesSearch = (q.text?.toLowerCase() || "").includes(search.toLowerCase()) || 
                          (q.author?.toLowerCase() || "").includes(search.toLowerCase());
    
    if (filter === "likes") {
       return matchesSearch && user && q.likes?.includes(user.id);
    }
    if (filter === "profile") {
       return matchesSearch && user && q.createdBy === user.id;
    }
    return matchesSearch;
  });

  useEffect(() => {
    if (filter === "post") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filter]);

  const handleLike = async (id) => {
    if (!user) {
      toast.error("Please login to like quotes");
      return;
    }
    try {
      await likeQuoteAPI(id);
      loadQuotes();
    } catch (error) {
      toast.error("Error liking quote");
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingQuote) {
        const res = await updateQuoteAPI(editingQuote._id, data);
        toast.success(res.message);
        setEditingQuote(null);
      } else {
        const res = await createQuoteAPI(data);
        toast.success(res.message);
      }
      loadQuotes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) return;
    try {
      await deleteQuoteAPI(id);
      toast.success("Quote deleted");
      loadQuotes();
    } catch (error) {
      toast.error("Error deleting quote");
    }
  };

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic Title and Subtitle based on Filter
  const getSectionInfo = () => {
    switch(filter) {
      case "likes": return { title: "My Liked Quotes", sub: "A collection of words that touched your heart." };
      case "profile": return { title: "My Personal Posts", sub: "The wisdom you've shared with the world." };
      case "post": return { title: "Share Your Wisdom", sub: "Inspire others with your unique perspective." };
      case "search": return { title: "Discovery Hub", sub: "Find inspiration across authors and themes." };
      default: return { title: "Explore Amazing Quotes", sub: "Discover inspiration from the world's greatest thinkers." };
    }
  };

  const { title, sub } = getSectionInfo();

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#050505] min-h-screen text-black dark:text-white pt-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {filter === "all" && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-b from-black via-gray-700 to-gray-500 dark:from-white dark:via-white dark:to-gray-500 bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
              {sub}
            </p>
          </div>
        )}

        {/* Show Search bar on Search or All sections */}
        {(filter === "search" || filter === "all") && (
          <div className="w-full max-w-2xl mx-auto mb-16 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text"
                placeholder="Search quotes or authors..."
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-2xl focus:border-rose-500 outline-none transition-all text-black dark:text-white text-base shadow-2xl"
                value={search}
                onChange={(e) => setSearchParams({ filter: "search", search: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Professional Category Pills - Only show on Search or All */}
        {(filter === "search" || filter === "all") && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {['Motivation', 'Wisdom', 'Life', 'Success', 'Love', 'Philosophy'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSearchParams({ filter: "search", search: cat })}
                className={`px-5 py-2 rounded-full border transition-all active:scale-95 shadow-xl text-xs font-bold ${
                  search === cat 
                  ? "bg-rose-500 border-rose-500 text-white" 
                  : "bg-white dark:bg-[#0a0a0a] border-black/5 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                #{cat}
              </button>
            ))}
          </div>
        )}

        {/* Show Get Started only for guests on Home */}
        {!user && filter === "all" && (
          <div className="flex justify-center mb-16">
            <Link 
              to="/register" 
              className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm transition-all shadow-xl shadow-rose-900/20"
            >
              Get Started for Free
            </Link>
          </div>
        )}

        {/* Show Quote Form only on Post section or when editing */}
        {user && (filter === "post" || editingQuote) && (
          <div className="mb-12">
            <QuoteForm 
              onSubmit={handleSubmit} 
              initialData={editingQuote} 
              onCancel={() => setEditingQuote(null)}
            />
          </div>
        )}

        {filter === "profile" && user ? (
          <div className="max-w-md mx-auto bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-3xl p-8 text-center shadow-2xl transition-colors">
            <div className="relative inline-block group mb-6">
              <input 
                type="file" 
                className="hidden" 
                id="profile-page-upload" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("profilePic", file);
                    import("../services/api").then(({ updateProfileAPI }) => {
                      updateProfileAPI(formData).then(res => {
                        localStorage.setItem("user", JSON.stringify({ ...user, profilePic: res.user.profilePic }));
                        toast.success("Profile photo updated!");
                        window.location.reload();
                      }).catch(() => toast.error("Upload failed"));
                    });
                  }
                }}
              />
              <label htmlFor="profile-page-upload" className="cursor-pointer block relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-rose-500/20 overflow-hidden group-hover:border-rose-500 transition-all shadow-2xl mx-auto">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-rose-500 font-black text-3xl">
                      {user.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 bg-rose-600 p-2 rounded-full text-white shadow-lg transform group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </label>
            </div>
            
            <h2 className="text-2xl font-black text-black dark:text-white mb-1">{user.name}</h2>
            <p className="text-gray-500 text-xs font-medium mb-6">{user.email}</p>
            
            <div className="grid grid-cols-2 gap-3 max-w-[280px] mx-auto">
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                <div className="text-xl font-black text-rose-500">{(quotes || []).filter(q => q.createdBy === user.id).length}</div>
                <div className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Posts</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                <div className="text-xl font-black text-rose-500">{(quotes || []).filter(q => q.likes?.includes(user.id)).length}</div>
                <div className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Liked</div>
              </div>
            </div>
          </div>
        ) : filter !== "post" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((q) => (
                <QuoteCard 
                  key={q._id} 
                  quote={q} 
                  onLike={handleLike} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  currentUserId={user?.id}
                  userRole={user?.role}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 mb-6 text-xl">No quotes found here yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}