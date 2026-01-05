import mongoose from "mongoose";

const quotationItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    category: {
        type: String
    },
    description: {
        type: String
    }
});

const quotationSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        customerName: {
            type: String,
            required: true
        },
        customerEmail: {
            type: String,
            required: true
        },
        items: {
            type: [quotationItemSchema],
            required: true,
            validate: {
                validator: function(v) {
                    return v && v.length > 0;
                },
                message: 'Quotation must have at least one item'
            }
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'quoted', 'rejected'],
            default: 'pending'
        },
        notes: {
            type: String
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
