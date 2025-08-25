import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import InputField from "../../Component/Reusable/InputField";
import Button from "../../Component/Reusable/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setSignupData } from "../../Slice/authSlice";
import { sendotp } from "../../Service/Operations/AuthAPI";

const SignupForm = ({ setLoginTypeForm }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { userName, email, password, confirmPassword } = formData


  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword){
      toast.error("Passwords Do Not Match");
      return;
    }
    dispatch(setSignupData(formData));
    dispatch(sendotp(formData.email , navigate));

    setFormData({
      userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    })
  };


  const isValid =
    formData.userName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-4">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-sm text-gray-600">Join our AI learning platform</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded"></div>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        <InputField
          label="Full Name"
          name="userName"
          type="text"
          placeholder="Enter your full name"
          value={formData.userName}
          onChange={onChangeHandler}
          required
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={onChangeHandler}
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={onChangeHandler}
          required
          
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={onChangeHandler}
          required
          
        />

        <Button
          type="submit"
          content="Create Account"
          variant="primary"
          size="md"
          fullWidth
          condition={isValid}
        />
      </form>
    </div>
  );
};

export default SignupForm;
