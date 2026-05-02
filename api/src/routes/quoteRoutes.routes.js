import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { createQuote, deleteQuote, getAllQuotes, getQuoteById, toggleLike, updateQuote } from "../controller/quoteController.controller.js"
export const quoteRoutes = express.Router()
quoteRoutes.post("/create", authMiddleware, createQuote)
quoteRoutes.get("/", getAllQuotes)
quoteRoutes.get("/:id", getQuoteById)
quoteRoutes.delete("/:id", authMiddleware, deleteQuote)
quoteRoutes.put("/:id", authMiddleware, updateQuote)
quoteRoutes.post("/:id/like", authMiddleware, toggleLike);