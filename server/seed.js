import mongoose from "mongoose";
import { config } from "dotenv";
import Db from "./src/database/Db.js";
import { Quote } from "./src/models/quoteModel.js";
import { User } from "./src/models/userModel.js";

config();

const quotes = [
  // Motivation
  { text: "Your limitation—it's only your imagination.", author: "Unknown", category: "Motivation" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "Motivation" },
  { text: "Sometimes later becomes never. Do it now.", author: "Unknown", category: "Motivation" },
  { text: "Great things never come from comfort zones.", author: "Unknown", category: "Motivation" },
  
  // Wisdom
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "Wisdom" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "Wisdom" },
  { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", category: "Wisdom" },
  
  // Life
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Life" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "Life" },
  
  // Success
  { text: "Success is not final; failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "Success" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "Success" },
  
  // Love
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", category: "Love" },
  { text: "Where there is love there is life.", author: "Mahatma Gandhi", category: "Love" },
  { text: "Love all, trust a few, do wrong to none.", author: "William Shakespeare", category: "Love" },
  
  // Philosophy
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", category: "Philosophy" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Philosophy" },
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "Philosophy" }
];

const seedDB = async () => {
  try {
    await Db();
    console.log("Connected to DB...");

    const user = await User.findOne();
    if (!user) {
      console.log("No user found. Please register a user first.");
      process.exit();
    }

    // Add search terms to text to match our simple search logic
    const preparedQuotes = quotes.map(q => ({
      text: `${q.text} #${q.category}`,
      author: q.author,
      createdBy: user._id,
      likes: []
    }));

    await Quote.deleteMany({}); // Optional: clear existing
    await Quote.insertMany(preparedQuotes);

    console.log("Database seeded successfully with all types of quotes!");
    process.exit();
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();
