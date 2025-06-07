import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clearAllErrors,
  getUser,
  resetProfile,
  updateProfile,
} from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { Link } from "react-router-dom";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isUpdated, message } = useSelector(
    (state) => state.user
  );

  // Initialize states with safe fallback if user is undefined
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || "");
  const [portfolioURL, setPortfolioURL] = useState(user?.portfolioURL || "");
  const [linkedInURL, setLinkedInURL] = useState(
    user?.linkedInURL === "undefined" ? "" : user?.linkedInURL || ""
  );
  const [githubURL, setGithubURL] = useState(
    user?.githubURL === "undefined" ? "" : user?.githubURL || ""
  );
  const [instagramURL, setInstagramURL] = useState(
    user?.instagramURL === "undefined" ? "" : user?.instagramURL || ""
  );
  const [twitterURL, setTwitterURL] = useState(
    user?.twitterURL === "undefined" ? "" : user?.twitterURL || ""
  );
  const [facebookURL, setFacebookURL] = useState(
    user?.facebookURL === "undefined" ? "" : user?.facebookURL || ""
  );

  // Avatar and Resume URLs or files
  const [avatar, setAvatar] = useState(user?.avatar?.url || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");
  const [resume, setResume] = useState(user?.resume?.url || "");
  const [resumePreview, setResumePreview] = useState(user?.resume?.url || "");

  // Handlers for file input changes
  const avatarHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumePreview(reader.result);
        setResume(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    // Create form data for multipart upload
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("aboutMe", aboutMe);
    formData.append("portfolioURL", portfolioURL);
    formData.append("linkedInURL", linkedInURL);
    formData.append("githubURL", githubURL);
    formData.append("instagramURL", instagramURL);
    formData.append("twitterURL", twitterURL);
    formData.append("facebookURL", facebookURL);
    if (avatar && typeof avatar !== "string") formData.append("avatar", avatar);
    if (resume && typeof resume !== "string") formData.append("resume", resume);

    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isUpdated) {
      dispatch(getUser());
      dispatch(resetProfile());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, isUpdated, message]);

  // Keep inputs updated if user changes (optional)
  useEffect(() => {
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setAboutMe(user?.aboutMe || "");
    setPortfolioURL(user?.portfolioURL || "");
    setLinkedInURL(user?.linkedInURL === "undefined" ? "" : user?.linkedInURL || "");
    setGithubURL(user?.githubURL === "undefined" ? "" : user?.githubURL || "");
    setInstagramURL(user?.instagramURL === "undefined" ? "" : user?.instagramURL || "");
    setTwitterURL(user?.twitterURL === "undefined" ? "" : user?.twitterURL || "");
    setFacebookURL(user?.facebookURL === "undefined" ? "" : user?.facebookURL || "");
    setAvatar(user?.avatar?.url || "");
    setAvatarPreview(user?.avatar?.url || "");
    setResume(user?.resume?.url || "");
    setResumePreview(user?.resume?.url || "");
  }, [user]);

  return (
    <div className="w-full h-full">
      <div>
        <div className="grid w-full gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">Update Profile</h1>
            <p className="text-balance text-muted-foreground">Update Your Profile Here</p>
          </div>

          <div className="grid gap-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
              {/* Avatar Section */}
              <div className="grid gap-2 w-full sm:w-72">
                <Label>Profile Image</Label>
                <img
                  src={avatarPreview || "/avatarHolder.jpg"}
                  alt="avatar"
                  className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl object-cover"
                />
                <input
                  type="file"
                  onChange={avatarHandler}
                  accept="image/*"
                  className="avatar-update-btn"
                />
              </div>

              {/* Resume Section */}
              <div className="grid gap-2 w-full sm:w-72">
                <Label>Resume</Label>
                {resumePreview ? (
                  <Link to={typeof resume === "string" ? resume : "#"} target="_blank" rel="noopener noreferrer">
                    <img
                      src={resumePreview}
                      alt="resume preview"
                      className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl object-contain"
                    />
                  </Link>
                ) : (
                  <p>No resume uploaded</p>
                )}
                <input
                  type="file"
                  onChange={resumeHandler}
                  accept=".pdf,.doc,.docx"
                  className="avatar-update-btn"
                />
              </div>
            </div>

            {/* Profile Info Inputs */}
            <InputField label="Full Name" value={fullName} onChange={setFullName} />
            <InputField label="Email" type="email" value={email} onChange={setEmail} />
            <InputField label="Phone" value={phone} onChange={setPhone} />
            <TextareaField label="About Me" value={aboutMe} onChange={setAboutMe} />
            <InputField label="Portfolio URL" value={portfolioURL} onChange={setPortfolioURL} />
            <InputField label="LinkedIn URL" value={linkedInURL} onChange={setLinkedInURL} />
            <InputField label="Github URL" value={githubURL} onChange={setGithubURL} />
            <InputField label="Instagram URL" value={instagramURL} onChange={setInstagramURL} />
            <InputField label="Twitter(X) URL" value={twitterURL} onChange={setTwitterURL} />
            <InputField label="Facebook URL" value={facebookURL} onChange={setFacebookURL} />

            {/* Submit Button */}
            {!loading ? (
              <Button onClick={handleUpdateProfile} className="w-full">
                Update Profile
              </Button>
            ) : (
              <SpecialLoadingButton content="Updating" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted input component for cleaner code
const InputField = ({ label, value, onChange, type = "text" }) => (
  <div className="grid gap-2">
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={label}
    />
  </div>
);

// Extracted textarea component
const TextareaField = ({ label, value, onChange }) => (
  <div className="grid gap-2">
    <Label>{label}</Label>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={label}
      rows={4}
    />
  </div>
);

export default UpdateProfile;
