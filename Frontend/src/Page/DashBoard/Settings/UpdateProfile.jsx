import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Camera } from "lucide-react";
import Button from "../../../Component/Reusable/Button";
import InputField from "../../../Component/Reusable/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDisplayPicture,
  updateProfile,
  getUserProfileDetaile
} from "../../../Service/Operations/ProfileAPI";
import toast from "react-hot-toast";


const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [profileImage, setProfileImage] = useState(user.image);
  const [profileFile, setProfileFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    userName: user.userName || "",
    email: user.email || "",
    contactNumber: user.additionalDetails.contactNumber || "",
    location: user.additionalDetails.location || "",
    bio: user.additionalDetails.bio || "",
    gender: user.additionalDetails.gender || "",
  });

  const { userName, email, contactNumber, location, bio, gender } = formData;

  const genderOptions = ["Male", "Female", "Other"];

  // Handle input changes
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfileImage(URL.createObjectURL(file)); // for preview
  };

  // Handle form submission
  const handleSubmit = (e) => {
  e.preventDefault();

  try {
    if (profileFile) {
      dispatch(updateDisplayPicture(token, profileFile));
    }

    if( formData.bio || formData.gender ||formData.location || formData.contactNumber ){
      dispatch(updateProfile(token, formData ));
      dispatch(getUserProfileDetaile(token));
    }
    navigate("/profile");
  } catch (error) {
    toast.error("Failed to update profile");
    console.error(error);
  }
};


  return (
    <div className="min-h-screen bg-white px-6 py-8 text-gray-900">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-500 text-lg">
            Update your profile details and image
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Picture */}
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Profile Picture</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <Button
                variant="primary"
                icon={Camera}
                content="Upload New Photo"
                click={() =>
                  document.getElementById("profileUploadInput").click()
                }
              />
              <input
                id="profileUploadInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-gray-500 text-sm mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="border border-gray-200 rounded-2xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="userName"
            value={userName}
            onChange={onChangeHandler}
            placeholder="Enter your full name"
            
          />
          <InputField
            label="Email Address"
            name="email"
            value={email}
            onChange={onChangeHandler}
            type="email"
            disabled
            helperText="Email cannot be changed"
          />
          <InputField
            label="Phone Number"
            name="contactNumber"
            value={contactNumber}
            onChange={onChangeHandler}
            placeholder="Enter your phone number"
            
          />
          <InputField
            label="Address"
            name="location"
            value={location}
            onChange={onChangeHandler}
            placeholder="Enter your address"
            as="textarea"
            rows={3}
            
          />
          <InputField
            label="Bio"
            name="bio"
            value={bio}
            onChange={onChangeHandler}
            placeholder="Write something about yourself"
            as="textarea"
            rows={3}
          />
          <div className="flex flex-col w-full gap-1.5">
            <label htmlFor="gender" className="text-sm font-semibold text-gray-800">
              Gender
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={onChangeHandler}
        
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm h-11 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 text-gray-900 placeholder-gray-400"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            content="Cancel"
            click={() => navigate(-1)}
          />
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            content="Save Changes"
            disabled={isUploading}
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
