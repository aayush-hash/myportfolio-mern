import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Skill } from '../models/skillSchema.js';
import { v2 as cloudinary } from "cloudinary";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
    // Check if a file is uploaded
    if (!req.files || !req.files.svg) {
        return next(new ErrorHandler("Skill SVG is required!", 400));
    }

    const { svg } = req.files;
    const { title, proficiency } = req.body;

    // Validate required fields
    if (!title || !proficiency) {
        return next(new ErrorHandler("Please fill out the form!", 400));
    }

    // Upload SVG to Cloudinary
    let cloudinaryResponse;
    try {
        cloudinaryResponse = await cloudinary.uploader.upload(svg.tempFilePath, {
            folder: "PORTFOLIO_SKILLS_SVG",
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message || error);
        return next(new ErrorHandler("Failed to upload SVG to Cloudinary!", 500));
    }

    // Check for Cloudinary response errors
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Cloudinary upload failed!", 500));
    }

    // Create new skill in the database
    const skill = await Skill.create({
        title,
        proficiency,
        svg: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    // Respond with success
    res.status(200).json({
        success: true,
        message: "New Skill Added",
        skill,
    });
});



export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
      const { id } = req.params;
  
      // Find the skill by its ID
      const skill = await Skill.findById(id);
  
      // Check if the skill exists
      if (!skill) {
          return next(new ErrorHandler("Skill Not Found!", 404));
      }
  
      // Get the public_id of the SVG from the cloudinary reference
      const skillSvgId = skill.svg?.public_id;
  
      // If the SVG public_id exists, delete it from Cloudinary
      if (skillSvgId) {
          try {
              await cloudinary.uploader.destroy(skillSvgId);
          } catch (error) {
              console.error("Error deleting from Cloudinary:", error.message || error);
              return next(new ErrorHandler("Failed to delete skill SVG from Cloudinary!", 500));
          }
      }
  
      // Remove the skill from the database
      await Skill.findByIdAndDelete(id);
  
      // Send a success response
      res.status(200).json({
          success: true,
          message: "Skill Deleted!",
      });
  });



  export const updateSkill = catchAsyncErrors(async (req, res, next) => {
      const { id } = req.params;
      const { proficiency } = req.body;
  
      // Find the skill by ID
      const skill = await Skill.findById(id);
  
      // Check if the skill exists
      if (!skill) {
          return next(new ErrorHandler("Skill Not Found!", 404));
      }
  
      // Update the skill
      const updatedSkill = await Skill.findByIdAndUpdate(
          id,
          { proficiency },
          {
              new: true, // Return the updated document
              runValidators: true, // Run schema validators
          }
      );
  
      // Send a success response
      res.status(200).json({
          success: true,
          message: "Skill updated successfully",
          skill: updatedSkill, // Include the updated skill in the response
      });
  });

export const getAllSkills = catchAsyncErrors(async(req,res,next)=>{

      const skills = await Skill.find();
      res.status(200).json({
            success:true,
            skills,
      })
})
