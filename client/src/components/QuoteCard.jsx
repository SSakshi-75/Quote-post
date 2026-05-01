export default function QuoteCard({ quote, onLike, onDelete, onEdit, currentUserId, userRole }) {
  const isOwner = quote.createdBy === currentUserId;
  const isAdmin = userRole === "admin";

  return (
    <div className="bg-white dark:bg-[#0c0c0c] p-6 rounded-[1.5rem] text-black dark:text-white border border-black/5 dark:border-white/5 shadow-xl dark:shadow-2xl hover:border-rose-500/20 transition-all duration-300 group relative overflow-hidden">
      {/* Decorative Quote Icon */}
      <div className="absolute -top-2 -right-2 text-black/5 dark:text-white/5 text-7xl font-serif pointer-events-none group-hover:text-rose-500/5 transition-colors">
        "
      </div>

      <div className="relative z-10">
        <p className="text-lg font-medium leading-relaxed mb-6 italic font-serif text-gray-800 dark:text-gray-200">
          "{quote.text}"
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] text-rose-500 font-black uppercase tracking-[0.2em] mb-1">Author</span>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">— {quote.author}</p>
          </div>
          
          <div className="flex gap-2">
            {(isOwner || isAdmin) && (
              <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                {isOwner && (
                  <button
                    onClick={() => onEdit(quote)}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white transition-all rounded-full hover:bg-white/10"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => onDelete(quote._id)}
                  className={`w-7 h-7 flex items-center justify-center transition-all rounded-full hover:bg-white/10 ${isAdmin && !isOwner ? "text-rose-500" : "text-gray-500 hover:text-rose-500"}`}
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
            
            <button
              onClick={() => onLike(quote._id)}
              className="flex items-center gap-1.5 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white px-3.5 py-1.5 rounded-full transition-all border border-rose-500/10 font-black text-xs"
            >
              <span className="scale-90">❤️</span>
              <span>{quote.likes.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}