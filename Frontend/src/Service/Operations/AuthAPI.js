import { authEndpoints } from "../APIs";
import { apiConnector } from "../apiConnector";
import { setUser } from "../../Slice/profileSlice";
import { setLoading, setToken, setSignupData } from "../../Slice/authSlice";
import toast from "react-hot-toast";

const { 
  SENDOTP_API, 
  SIGNUP_API, 
  LOGIN_API, 
  FORGET_PASSWORD_API,
  RESETPASSWORD_API 
} = authEndpoints;

export function sendotp(email, navigate) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, { email, checkUserPresent: true });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-otp");
    } catch (error) {
      console.error("SENDOTP API ERROR", error);
      toast.error(error.response?.data?.message || error.message || "Could Not Send OTP");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}
export function signUp(
  userName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
      return;
    }

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        userName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Sign Up Successful");
      navigate("/register");
    } catch (error) {
      console.error("SIGNUP API ERROR", error);
      toast.error(error.response?.data?.message || error.message || "Sign Up Failed");
      // No need to navigate away, user is already on signup page
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    console.log("Login attempt:", { email, password: password ? "****" : "" }); // Mask password

    try {
      const response = await apiConnector("POST", LOGIN_API, { email, password });
      console.log("API response:", response);

      if (!response.data.success) {
        console.warn("Login failed:", response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      console.log("Token saved in localStorage:", response.data.token);

      if (response.data.safeUser) {
        dispatch(setUser(response.data.safeUser));
        localStorage.setItem("user", JSON.stringify(response.data.safeUser));
        console.log("User saved in localStorage:", response.data.safeUser);
      } else {
        console.warn("No user data returned from API");
      }

      console.log("Navigating to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      console.error("LOGIN API ERROR:", error);
      toast.error(error.response?.data?.message || error.message || "Login Failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
      console.log("Login process finished");
    }
  };
}

export function forgetPassword(email, navigate) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

   
    try {
      const response = await apiConnector("POST", FORGET_PASSWORD_API, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Password Link Send Successfully");
      navigate("/check-email");
   
    } catch (error) {
      console.error("RESETPASSWORD ERROR", error);
      toast.error(error.response?.data?.message || error.message || "Failed To Reset Password");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}
export function resetPassword(password, confirmPassword, token , navigate) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
      return;
    }

    try {
     const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        resetPasswordToken: token, // ✅ include token here
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      navigate("/register");
    } catch (error) {
      console.error("RESETPASSWORD ERROR", error);
      toast.error(error.response?.data?.message || error.message || "Failed To Reset Password");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    toast.success("Logged Out");
    navigate("/");
  };
}
