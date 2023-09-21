import mongoose from "mongoose";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import moment from "moment";

const jwtSecret = process.env.JWT_SECRET ?? '';

const ChangeEmailSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    email: String,
    token: String,
});

const AdminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        minlength: [5, "Full name must be at least 5 characters"],
        maxlength: [30, "Full name must be at most 30 characters"],
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Email is required"],
        match: [/\S+@\S+\.\S+/, 'Invalid email address'],
        index: true
    },
    salt: String,
    password: String,
    avatar: String,
    emailConfirmed: {
        type: Boolean,
        default: false,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: mongoose.Schema.Types.Date,
        default: null,
    },
    role: {
        type: String,
        enum: ['Admin', 'SuperAdmin'],
        default: 'Admin',
    },
}, { timestamps: true });

AdminSchema.methods.setLastLogin = async function () {
    this.lastLogin = moment().utc();
    await this.save();
};

AdminSchema.methods.setPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

AdminSchema.methods.isAdminActive = function () {
    return this.isActivated && !this.isBlocked;
};

AdminSchema.methods.validPassword = function (password: string) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

AdminSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 7);

    return jwt.sign({
        id: this._id,
        email: this.email,
        isAdmin: true,
        role: this.role,
        exp: exp.getTime() / 1000,
    }, jwtSecret);
};

AdminSchema.methods.generateActivationToken = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    const token = jwt.sign({
        id: this._id,
        activationEmail: this.email,
        exp: exp.getTime() / 1000,
    }, jwtSecret);

    return token;
};

AdminSchema.methods.generateResetToken = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    const token = jwt.sign({
        id: this._id,
        resetEmail: this.email,
        exp: exp.getTime() / 1000,
    }, jwtSecret);

    return token;
}

AdminSchema.methods.generateConfirmToken = function (confirmEmail: string) {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    const token = jwt.sign({
        id: this._id,
        confirmEmail,
        isAdmin: true,
        exp: exp.getTime() / 1000,
    }, jwtSecret);

    return token;
}

AdminSchema.methods.activateAdmin = function () {
    this.isActivated = true;
    this.emailConfirmed = true;
}

AdminSchema.methods.setSuspend = function (isSuspended: boolean) {
    this.isSuspended = isSuspended;
}

AdminSchema.methods.setBlock = function (isBlocked: boolean) {
    this.isBlocked = isBlocked;
}

AdminSchema.methods.toAuthAdmin = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        token: this.generateJWT(),
        avatar: this.avatar,
        emailConfirmed: this.emailConfirmed ?? false,
        isSuspended: this.isSuspended,
        isBlocked: this.isBlocked,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        role: this.role,
    };
};

AdminSchema.methods.toProfile = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        avatar: this.avatar,
        emailConfirmed: this.emailConfirmed ?? false,
        isSuspended: this.isSuspended,
        isBlocked: this.isBlocked,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        role: this.role,
    };
};

ChangeEmailSchema.methods.invalidate = async function () {
    return await this.deleteOne({ _id: this._id })
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const AdminChangeEmail = mongoose.models.AdminChangeEmail || mongoose.model("AdminChangeEmail", ChangeEmailSchema);

export { Admin, AdminChangeEmail }