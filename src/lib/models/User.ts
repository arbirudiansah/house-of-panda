import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET ?? '';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        default: "Unnamed",
        minlength: [5, "Full name must be at least 5 characters"],
        maxlength: [30, "Full name must be at most 30 characters"],
    },
    address: {
        type: String,
        unique: true,
        match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'],
        required: [true, "Wallet address is required"],
        index: true
    },
    nonce: {
        required: true,
        type: Number,
        default: Math.floor(Math.random() * 1000000),
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });


UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 7);

    return jwt.sign({
        id: this._id,
        address: this.address,
        exp: exp.getTime() / 1000,
    }, jwtSecret);
}


UserSchema.methods.toAuthUser = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        address: this.address,
        active: this.active,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        token: this.generateJWT(),
    };
}


const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User