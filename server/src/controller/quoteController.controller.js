import { Quote } from "../models/quoteModel.js";

// Create
export const createQuote = async (req, res) => {
  try {
    const { text, author, likes, tags } = req.body;
    if (!text || !author) {
      return res.status(400).json({ message: "Text and Author are Required" });
    }
    const quote = await Quote.create({
      text,
      author,
      tags: tags || [],
      createdBy: req.user._id,
    });
    return res
      .status(201)
      .json({ message: "Quote Created Successfully!!!", quote });
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
};

// Get All

export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    if (quotes.length === 0) {
      return res.status(200).json({ message: "No quotes found", quotes: [] });
    }
    return res.status(200).json({ message: "Get successfully", quotes });
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
};

// getAllById
export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "quote not found" });
    }
    return res
      .status(200)
      .json({ message: "quote fetched successfully", quote });
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
};

// update
export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author, tags } = req.body;

    // Check if quote exists and if user is the creator
    const quoteExists = await Quote.findById(id);
    if (!quoteExists) {
      return res.status(404).json({ message: "Quote not found" });
    }

    if (quoteExists.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to update this quote" });
    }

    const quote = await Quote.findByIdAndUpdate(
      id,
      {
        text,
        author,
        tags,
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "Quote updated successfully",
      quote,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete
export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find quote first to check permissions
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Allow if user is creator OR if user is admin
    if (quote.createdBy.toString() === req.user._id.toString() || req.user.role === "admin") {
      await Quote.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted successfully" });
    } else {
      return res.status(403).json({ message: "Not allowed to delete this quote" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
};

// like 
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const alreadyLiked = quote.likes.some(
      (uid) => uid.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // ❌ Unlike
      quote.likes = quote.likes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      // ❤️ Like
      quote.likes.push(userId);
    }

    await quote.save();

    return res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      totalLikes: quote.likes.length,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};