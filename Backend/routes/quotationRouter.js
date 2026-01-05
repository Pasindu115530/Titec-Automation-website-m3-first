import express from "express";
import {
    createQuotation,
    getAllQuotations,
    getCustomerQuotations,
    getQuotationById,
    updateQuotationStatus,
    deleteQuotation
} from "../controllers/quotationController.js";

const quotationRouter = express.Router();

// Create a new quotation request (customers and guests)
quotationRouter.post("/", createQuotation);

// Get all quotations (admin only)
quotationRouter.get("/", getAllQuotations);

// Get customer's own quotations
quotationRouter.get("/my-quotations", getCustomerQuotations);

// Get a single quotation by ID
quotationRouter.get("/:id", getQuotationById);

// Update quotation status (admin only)
quotationRouter.patch("/:id", updateQuotationStatus);

// Delete a quotation (admin only)
quotationRouter.delete("/:id", deleteQuotation);

export default quotationRouter;
