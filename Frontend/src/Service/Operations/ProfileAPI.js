import { apiConnector } from "../apiConnector";
import { setUser, setLoading } from "../../Slice/profileSlice";
import { profileEndpoints } from "../APIs";
import { logout } from "./AuthAPI";
import toast from "react-hot-toast";

const {
  GET_USER_DETAILS_API,
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = profileEndpoints;

// Fetch user profile
export function getUserProfileDetaile(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API , {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) throw new Error(response.data.message);

      const apiUser = response.data.data;

      const mappedUser = {
        ...apiUser,
        image: apiUser.additionalDetails?.imageUrl || "",
        contactNumber: apiUser.additionalDetails?.contactNumber || "",
        bio: apiUser.additionalDetails?.bio || "",
        location: apiUser.additionalDetails?.location || "",
        gender: apiUser.additionalDetails?.gender || "",
      };

      dispatch(setUser(mappedUser));
      localStorage.setItem("user", JSON.stringify(mappedUser));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch user profile");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}



// Update display picture
export function updateDisplayPicture(token, file ) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading...");
    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );

      console.log("Update DP response:", response.data);

      if (!response.data.success) throw new Error(response.data.message);

      const updatedUser = response.data.data;

      // Update Redux and localStorage
      const userObj = { ...updatedUser, image: updatedUser.imageUrl };
      dispatch(setUser(userObj));
      localStorage.setItem("user", JSON.stringify(userObj));

      toast.success("Display Picture Updated Successfully");
      
    } catch (error) {
      console.error("Error updating display picture:", error);
      toast.error(error?.response?.data?.message || "Could not update display picture");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Update profile info
export function updateProfile(token, formData ) {
  return async (dispatch) => {
    const toastId = toast.loading("Saving changes...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) throw new Error(response.data.message);

      const updatedUser = response.data.data;
      const userImage = updatedUser.image || updatedUser.imageUrl || `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUser.userName}`;

      dispatch(setUser({ ...updatedUser, image: userImage }));
      toast.success("Profile Updated Successfully");
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Could not update profile");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Change password
export function changePassword(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Changing password...");
    try {
      const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) throw new Error(response.data.message);
      toast.success("Password Changed Successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error?.response?.data?.message || "Could not change password");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Delete profile
export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting profile...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) throw new Error(response.data.message);

      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error(error?.response?.data?.message || "Could not delete profile");
    } finally {
      toast.dismiss(toastId);
    }
  };
}
