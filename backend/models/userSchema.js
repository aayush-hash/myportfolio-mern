import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name Required!"],
    },
    email: {
        type: String,
        required: [true, 'Email Required']
    },
    phone: {
        type: String,
        required: [true, 'Phone Number Required']
    },
    aboutMe: {
        type: String,
        required: [true, 'About Me Field Is Required']
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        minLength: [8, 'Password must be at least 8 characters!'],
        select: false, // Password will not be returned by default
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    portfolioURL: {
        type: String,
        required: [true, 'Portfolio URL is required']
    },
    githubURL: String,
    instagramURL: String,
    facebookURL: String,
    twitterURL: String,
    linkedInURL: String,
    resetPasswordToken: String, // Fixed typo
    resetPasswordExpire: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        console.log("Password not modified");
        next();
    } else {
        this.password = await bcrypt.hash(this.password, 10);
        console.log("Password hashed");
        next();
    }
});

// Compare password with hash
userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log("Comparing passwords");
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
    );
};

// Generate reset password token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

export const User = mongoose.model("User", userSchema);
