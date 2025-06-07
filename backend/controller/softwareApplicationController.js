import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from '../models/softwareApplicationSchema.js';
import { v2 as cloudinary } from "cloudinary";

export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Software Application Icon/Svg Required!", 400));
    }
    const { svg } = req.files;
    const { name } = req.body;

    if (!name) {
        return next(new ErrorHandler("Software's Name is Required!", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {
            folder: 'PORTFOLIO_SOFTWARE_APPLICATION'
        }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error",
            cloudinaryResponse.error || "Unknown Cloudinary Error"
        );
        return next(new ErrorHandler("Failed to upload software icon to Cloudinary", 500));
    }

    const softwareApplication = await SoftwareApplication.create({
        name,
        svg: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });

    res.status(200).json({
        success: true,
        message: 'New Software Application Added!',
        softwareApplication,
    });
});

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the software application by its ID
    const softwareApplication = await SoftwareApplication.findById(id);

    // Check if the software application exists
    if (!softwareApplication) {
        return next(new ErrorHandler("Software Application Not Found!", 404));
    }

    // Get the public_id of the SVG from the Cloudinary reference
    const softwareApplicationSvgId = softwareApplication.svg?.public_id;

    // If the SVG public_id exists, delete it from Cloudinary
    if (softwareApplicationSvgId) {
        await cloudinary.uploader.destroy(softwareApplicationSvgId);
    }

    // Remove the software application from the database
    await SoftwareApplication.deleteOne({ _id: id });

    // Send a success response
    res.status(200).json({
        success: true,
        message: "Software Application Deleted!",
    });
});

export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
    // Use the model `SoftwareApplication` to query the database
    const softwareApplications = await SoftwareApplication.find();

    res.status(200).json({
        success: true,
        softwareApplications, // Return all found applications
    });
});

export const getApplicationById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the software application by its ID
    const softwareApplication = await SoftwareApplication.findById(id);

    if (!softwareApplication) {
        return next(new ErrorHandler("Software Application Not Found!", 404));
    }

    res.status(200).json({
        success: true,
        softwareApplication,
    });
});
