import Quotation from "../models/Quotation.js";

// Create a new quotation request
export const createQuotation = async (req, res) => {
    try {
        const { customerId, customerName, customerEmail, items, notes } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Quotation must have at least one item" });
        }

        const quotation = new Quotation({
            customerId: customerId || req.user?.id,
            customerName: customerName || (req.user ? `${req.user.firstName} ${req.user.lastName}` : ''),
            customerEmail: customerEmail || req.user?.email,
            items,
            notes,
            status: 'pending'
        });

        await quotation.save();

        res.status(201).json({
            message: "Quotation request created successfully",
            quotation
        });
    } catch (error) {
        console.error('Error creating quotation:', error);
        res.status(500).json({ message: "Failed to create quotation request", error: error.message });
    }
};

// Get all quotations (admin only)
export const getAllQuotations = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const quotations = await Quotation.find()
            .populate('customerId', 'firstName lastName email')
            .sort({ submittedAt: -1 });

        res.status(200).json(quotations);
    } catch (error) {
        console.error('Error fetching quotations:', error);
        res.status(500).json({ message: "Failed to fetch quotations", error: error.message });
    }
};

// Get quotations for a specific customer
export const getCustomerQuotations = async (req, res) => {
    try {
        const customerId = req.user?.id;

        if (!customerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const quotations = await Quotation.find({ customerId })
            .sort({ submittedAt: -1 });

        res.status(200).json(quotations);
    } catch (error) {
        console.error('Error fetching customer quotations:', error);
        res.status(500).json({ message: "Failed to fetch quotations", error: error.message });
    }
};

// Get a single quotation by ID
export const getQuotationById = async (req, res) => {
    try {
        const { id } = req.params;
        const quotation = await Quotation.findById(id).populate('customerId', 'firstName lastName email');

        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        // Check if user has permission to view
        if (req.user?.role !== 'admin' && quotation.customerId?.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(quotation);
    } catch (error) {
        console.error('Error fetching quotation:', error);
        res.status(500).json({ message: "Failed to fetch quotation", error: error.message });
    }
};

// Update quotation status (admin only)
export const updateQuotationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        // Check if user is admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        // Validate status
        const validStatuses = ['pending', 'reviewed', 'quoted', 'rejected'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const quotation = await Quotation.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        res.status(200).json({
            message: "Quotation updated successfully",
            quotation
        });
    } catch (error) {
        console.error('Error updating quotation:', error);
        res.status(500).json({ message: "Failed to update quotation", error: error.message });
    }
};

// Delete a quotation (admin only)
export const deleteQuotation = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const quotation = await Quotation.findByIdAndDelete(id);

        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        res.status(200).json({ message: "Quotation deleted successfully" });
    } catch (error) {
        console.error('Error deleting quotation:', error);
        res.status(500).json({ message: "Failed to delete quotation", error: error.message });
    }
};
