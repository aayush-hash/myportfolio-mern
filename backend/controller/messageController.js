import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';
import { Message } from '../models/messageSchema.js';

// Send a message
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, email, subject, message } = req.body;

    if (!senderName || !email || !subject || !message) {
        return next(new ErrorHandler("Please fill in all fields!", 400));
    }

    const data = await Message.create({ senderName, email, subject, message });

    res.status(200).json({
        success: true,
        message: "Message Sent",
        data,
    });
});

// Get all messages
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});

// Delete a message
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Message ID", 400));
    }

    const message = await Message.findById(id);
    if (!message) {
        return next(new ErrorHandler("Message Already Deleted or Not Found", 404));
    }

    await message.deleteOne(); // or Message.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: "Message Deleted",
    });
});
