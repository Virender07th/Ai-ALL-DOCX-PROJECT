import React, { useEffect, useState } from "react";
import { Shield, RotateCcw } from "lucide-react";
import OtpInput from "react-otp-input";
import Button from "../../Component/Reusable/Button";
import { useNavigate } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { sendotp , signUp } from "../../Service/Operations/AuthAPI";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const  {signupData , loading} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!signupData){
      navigate("/signup");
    }
  } ,[]);

  const handleVerify = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp);
    const {
      userName,
      email,
      password,
      confirmPassword,
    } = signupData;
    navigate("/dashboard")

    dispatch(signUp(userName,
      email,
      password,
      confirmPassword,otp, navigate))
    // navigate("/reset-password");

  };

  const handleResend = () => {
    dispatch(sendotp(signupData.email));
    console.log("Resend OTP");
    // Implement resend logic
  };

  const isValidOtp = otp.length === 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Enter Verification Code
          </h1>
          <p className="text-sm text-gray-600">
            Please enter the 6-digit code we sent to your email address.
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded"></div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-6"
        >
          <div className="space-y-4 text-center">
            <label className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  type="tel"
                  placeholder="-"
                  style={{
                    boxShadow:
                      "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-b-3 border-[#DBE0E5] bg-white rounded-md text-gray-700 aspect-square text-center text-lg focus:outline-2 focus:outline-gray-100"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
          </div>

          <Button
            type="submit"
            data={isValidOtp}
            condition={isValidOtp}
            click={handleVerify}
            content="Verify Code"
            variant="primary"
            fullWidth
          />
        </form>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <Button
            type="button"
            content="Resend Code"
            click={handleResend}
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            iconPosition="left"
          />
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
