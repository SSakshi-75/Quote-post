import { useState, useEffect } from "react";

export default function QuoteForm({ onSubmit, initialData = null, onCancel = null }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setAuthor(initialData.author);
    } else {
      setText("");
      setAuthor("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !author) return;
    onSubmit({ text, author });
    if (!initialData) {
      setText("");
      setAuthor("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-2xl mb-8 border border-black/5 dark:border-gray-800 shadow-2xl transition-colors">
      <h3 className="text-xl font-bold mb-4 text-rose-500">
        {initialData ? "Edit Quote" : "Post a New Quote"}
      </h3>
      <textarea
        className="w-full p-4 mb-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all resize-none text-black dark:text-white h-24"
        placeholder="Write something inspiring..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <input
          className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-black/5 dark:border-gray-700 focus:border-rose-500 outline-none transition-all text-black dark:text-white"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <div className="flex gap-2">
          {initialData && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-3 text-black dark:text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 px-6 py-3 text-white font-bold rounded-xl transition-all transform active:scale-95 shadow-lg shadow-rose-900/20"
          >
            {initialData ? "Update" : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}