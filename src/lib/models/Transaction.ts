import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    from: {
        type: String,
        match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'],
        required: [true, "Wallet address is required"],
        index: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
    minted: {
        type: Number,
        required: [true, "Minted amount is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    trxHash: {
        type: String,
        unique: true,
        required: [true, "Transaction hash is required"],
    },
    status: {
        type: String,
        default: "Pending",
    },
    meta: { type: Object, default: {} },
}, { timestamps: true });


const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction