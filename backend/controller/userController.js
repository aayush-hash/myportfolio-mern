import { v2 as cloudinary } from 'cloudinary';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';
import { User } from '../models/userSchema.js';
import {generateToken} from "../utils/jwtToken.js"
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto'

export const register = catchAsyncErrors(async(req,res,next)=>{
      if(!req.files || Object.keys(req.files).length === 0){
            return next(new ErrorHandler("Avatar Required!",400))
      }
      const {avatar,resume}= req.files;

      const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath,
            {
                  folder:'AVATARS'
            }
      );
      if(!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error){
            console.error(
                  "Cloudinary Error",
                  cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error"

            );
      }

  const cloudinaryResponseForResume = await cloudinary.uploader.upload(resume.tempFilePath,
            {
                  folder:'MY_RESUME'
            }
      );
      if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error){
            console.error(
                  "Cloudinary Error",
                  cloudinaryResponseForResume.error || "Unknown Cloudinary Error"

            );
      }

      const {   
      fullName,
      email,
      phone,
      aboutMe,
      password,
      portfolioURL,
      githubURL,
      instagramURL,
      facebookURL,
      twitterURL,
      linkedInURL
} = req.body;

const user = await User.create({
      fullName,
      email,
      phone,
      aboutMe,
      password,
      portfolioURL,
      githubURL,
      instagramURL,
      facebookURL,
      twitterURL,
      linkedInURL,
      avatar:{
            public_id: cloudinaryResponseForAvatar.public_id,
            url:cloudinaryResponseForAvatar.secure_url,
      },

      resume:{
            public_id: cloudinaryResponseForResume.public_id,
            url:cloudinaryResponseForResume.secure_url,
      },
})
generateToken(user,"User Registered!",201,res)
});

//loggin controller
export const login = catchAsyncErrors(async (req, res, next) => {
    console.log("Request received at backend with body:", req.body); // Debug log
    const { email, password } = req.body;
  
    if (!email || !password) {
      console.error("Missing email or password."); // Debug log
      return next(new ErrorHandler("Email and Password are Required!", 400));
    }
  
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.error("User not found."); // Debug log
      return next(new ErrorHandler("Invalid Email or Password!", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      console.error("Password mismatch."); // Debug log
      return next(new ErrorHandler("Invalid Email or Password!", 401));
    }
  
    console.log("Login successful for user:", user); // Debug log
    generateToken(user, 'Logged In', 200, res);
  });
  

  //logout
  export const logout = catchAsyncErrors(async (req, res, next) => {
      res.status(200)
         .cookie("token", "", {
             expires: new Date(Date.now()),  // expires now (immediately)
             httpOnly: true,
         })
         .json({
             success: true,
             message: "logged out"
         });
  });

  //get user 

  export const getUser = catchAsyncErrors(async(req,res,next)=>{
      const user = await User.findById(req.user.id);
      res.status(200).json({
            success:true,
            user,
      })
  })


//for updating profile(avatar)
  export const updateProfile = catchAsyncErrors(async(req,res,next)=>{
      const newUserdata = {
      fullName:req.body.fullName,
      email:req.body.email,
      phone:req.body.phone,
      aboutMe:req.body.aboutMe,
      
      portfolioURL:req.body.portfolioURL,
      githubURL:req.body.githubURL,
      instagramURL:req.body.instagramURL,
      facebookURL:req.body.facebookURL,
      twitterURL:req.bodytwitterURL,
      linkedInURL:req.body.linkedInURL,

      }

      if(req.files && req.files.avatar){
            const avatar = req.files.avatar;
            const user = await User.findById(req.user.id);
            const profileImageId = user.avatar.public_id;
            await cloudinary.uploader.destroy(profileImageId);
            const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath,
                  {
                        folder:'AVATARS'
                  }
            )
                  newUserdata.avatar = {
                        public_id: cloudinaryResponse.public_id,
                        url:cloudinaryResponse.secure_url
                  }
           
      }


      if(req.files && req.files.resume){
            const resume = req.files.resume;
            const user = await User.findById(req.user.id);
            const resumeId = user.resume.public_id;
            await cloudinary.uploader.destroy(resumeId);
            const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath,
                  {
                        folder:'MY_RESUME'
                  }
            );
                  newUserdata.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url:cloudinaryResponse.secure_url
                  }
          
      }
      const user = await User.findByIdAndUpdate(req.user.id,newUserdata,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
      })
      res.status(200).json({
            success:true,
            message:'Profile Updated!',
            user,
      })

  })

  //updatePassword
 // Update Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
      const { currentPassword, newPassword, confirmedNewPassword } = req.body;
  
      // Check if all fields are provided
      if (!currentPassword || !newPassword || !confirmedNewPassword) {
          return next(new ErrorHandler("Please fill all fields", 400));
      }
  
      // Fetch user and include password (since it's excluded by default)
      const user = await User.findById(req.user.id).select("+password");
  
      // Check if the current password is correct
      const isPasswordMatched = await user.comparePassword(currentPassword);
      if (!isPasswordMatched) {
          return next(new ErrorHandler("Incorrect current password", 400));
      }
  
      // Check if the new password and confirmation match
      if (newPassword !== confirmedNewPassword) {
          return next(new ErrorHandler("New password and confirmation do not match", 400));
      }
  
      // Update the password
      user.password = newPassword;
      await user.save(); // Save the updated user document
  
      // Send a success response
      res.status(200).json({
          success: true,
          message: "Password updated!",
      });
  });


  // user ko profile without authenticate get garna frontend bata
  // Fetch user for portfolio
export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
      const id = req.params.id; // Dynamically get the user ID from request parameters
      const user = await User.findById(id);
  
      if (!user) {
          return next(new ErrorHandler("User not found", 404));
      }
  
      res.status(200).json({
          success: true,
          user,
      });
  });
  
  // Forget password
  export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
      const { email } = req.body;
  
      if (!email) {
          return next(new ErrorHandler("Email is required", 400));
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
          return next(new ErrorHandler("User not found!", 404));
      }
  
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
  
      const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
      const message = `Your Reset Password Token is:\n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore it.`;
  
      try {
          await sendEmail({
              email: user.email,
              subject: "Personal Portfolio Dashboard Password Recovery",
              message,
          });
  
          res.status(200).json({
              success: true,
              message: `Email sent to ${user.email} successfully.`,
          });
      } catch (error) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save({ validateBeforeSave: false });
  
          return next(new ErrorHandler("Failed to send email. Please try again later.", 500));
      }
  });
  
  // Reset password
  export const resetPassword = catchAsyncErrors(async (req, res, next) => {
      const { token } = req.params;
  
      const resetPasswordToken = crypto
          .createHash('sha256')
          .update(token)
          .digest('hex');
  
      const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
          return next(new ErrorHandler("Reset Password Token is invalid or has expired", 400));
      }
  
      if (req.body.password !== req.body.confirmedNewPassword) {
          return next(new ErrorHandler("Password and Confirmed Password do not match", 400));
      }
  
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
  
      generateToken(user, "Password reset successfully", 200, res);
  });
  
  
  

