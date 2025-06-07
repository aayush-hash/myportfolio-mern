import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from '../models/projectSchema.js';
import { v2 as cloudinary } from "cloudinary";

// Add New Project
export const addNewProject = catchAsyncErrors(async (req, res, next) => {
    // Check if files are uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Project Banner Image Required!", 400));
    }

    const { projectBanner } = req.files;
    const { 
        title,
        description,
        gitRepoLink,
        projectLink,
        technologies,
        stack,
        deployed 
    } = req.body;

    // Validate all required fields
    if (
        !title ||
        !description ||
        !gitRepoLink ||
        !projectLink ||
        !technologies ||
        !stack ||
        deployed === undefined
    ) {
        return next(new ErrorHandler("Please Provide All Details", 400));
    }

    // Convert `deployed` to Boolean
    const isDeployed = deployed.toLowerCase() === "yes";

    // Upload project banner to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
        projectBanner.tempFilePath,
        {
            folder: 'PROJECT_IMAGES',
        }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary Error"
        );
        return next(new ErrorHandler("Failed to upload project banner to Cloudinary", 500));
    }

    // Create new project in the database
    const project = await Project.create({
        title,
        description,
        gitRepoLink,
        projectLink,
        technologies,
        stack,
        deployed: isDeployed, // Save converted Boolean
        projectBanner: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: 'New Project Added',
        project,
    });
});

// Update Existing Project
export const updateProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Fetch the project by ID
    const existingProject = await Project.findById(id);
    if (!existingProject) {
        return next(new ErrorHandler("Project not found!", 404));
    }

    // Prepare updated data
    const updatedProjectData = {
        title: req.body.title || existingProject.title,
        description: req.body.description || existingProject.description,
        gitRepoLink: req.body.gitRepoLink || existingProject.gitRepoLink,
        projectLink: req.body.projectLink || existingProject.projectLink,
        technologies: req.body.technologies || existingProject.technologies,
        stack: req.body.stack || existingProject.stack,
        deployed: req.body.deployed !== undefined 
            ? req.body.deployed.toLowerCase() === "yes" 
            : existingProject.deployed,
    };

    // Handle project banner update
    if (req.files && req.files.projectBanner) {
        const projectBanner = req.files.projectBanner;

        // Delete old banner from Cloudinary
        const projectBannerId = existingProject.projectBanner?.public_id;
        if (projectBannerId) {
            await cloudinary.uploader.destroy(projectBannerId);
        }

        // Upload new banner to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            projectBanner.tempFilePath,
            {
                folder: "PROJECT_IMAGES",
            }
        );

        updatedProjectData.projectBanner = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    // Update the project in the database
    const updatedProject = await Project.findByIdAndUpdate(id, updatedProjectData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: "Project updated successfully!",
        project: updatedProject,
    });
});

// Delete Project
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        return next(new ErrorHandler("Project Not Found!", 404));
    }

    // Delete project banner from Cloudinary
    if (project.projectBanner?.public_id) {
        await cloudinary.uploader.destroy(project.projectBanner.public_id);
    }

    // Delete project from database
    await project.deleteOne();

    res.status(200).json({
        success: true,
        message: "Project Deleted!",
    });
});

// Get All Projects
export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
    const projects = await Project.find();
    res.status(200).json({
        success: true,
        projects,
    });
});

// Get Single Project
export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        return next(new ErrorHandler("Project Not Found!", 404));
    }

    res.status(200).json({
        success: true,
        project,
    });
});
