import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineSchema.js";


export const postTimeline = catchAsyncErrors(async (req, res, next) => {
      const { title, description, from, to } = req.body;
  
      // Create a new timeline entry
      const timeline = await Timeline.create({
          title,
          description,
          timeline: { from, to },
      });
  
      // Respond with success and the new timeline entry
      res.status(200).json({
          success: true,
          message: 'Timeline Added',
          timeline, // Updated to correctly send the created timeline
      });
  });

export const deleteTimeline = catchAsyncErrors(async(req,res,next)=>{
      const {id} = req.params;
      const timeline = await Timeline.findById(id);
      if(!timeline) {
            return next(new ErrorHandler("Timeline not Found!",404))
      }
      await timeline.deleteOne();
      res.status(200).json({
            success:true,
            message:'Timeline deleted!',



      })
})
export const getAllTimelines = catchAsyncErrors(async(req,res,next)=>{

      const timelines = await Timeline.find();
      res.status(200).json({
            success:true,
            timelines,
      })
})
