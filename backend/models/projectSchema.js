import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true, // Removes unnecessary whitespace
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
            trim: true,
        },
        gitRepoLink: {
            type: String,
            required: [true, "Git repository link is required"],
            trim: true,
            validate: {
                validator: function (value) {
                    // Basic validation for a URL
                    return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value);
                },
                message: "Invalid Git repository URL",
            },
        },
        projectLink: {
            type: String,
            required: [true, "Project link is required"],
            trim: true,
            validate: {
                validator: function (value) {
                    return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value);
                },
                message: "Invalid project URL",
            },
        },
        technologies: {
            type: [String],
            required: [true, "Technologies used are required"],
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: "At least one technology is required",
            },
        },
        stack: {
            type: [String],
            required: [true, "Tech stack is required"],
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: "At least one stack item is required",
            },
        },
        deployed: {
            type: Boolean,
            required: [true, "Deployment status is required"],
        },
        projectBanner: {
            public_id: {
                type: String,
                required: [true, "Banner public ID is required"],
            },
            url: {
                type: String,
                required: [true, "Banner URL is required"],
                validate: {
                    validator: function (value) {
                        return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value);
                    },
                    message: "Invalid banner URL",
                },
            },
        },
    },
    { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
