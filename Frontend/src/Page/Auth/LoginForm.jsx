import React, { useState } from "react";
import { LogIn } from "lucide-react";
import InputField from "../../Component/Reusable/InputField";
import Button from "../../Component/Reusable/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../Service/Operations/AuthAPI";

const LoginForm = ({ setLoginTypeForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login( formData.email , formData.password , navigate ));
    setFormData({
      email :"",
      password:"",
    })
    
  };

  const isValid = formData.email && formData.password;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-600">Sign in to your account</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded"></div>
      </div>

      {/* Form */}
      <form onSubmit={submitHandler} className="space-y-4">
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={onChangeHandler}
          required
        />

        <Button
          type="submit"
          data={isValid}
          condition={isValid}
          content="Sign In"
          size="lg"
          variant="primary"
          fullWidth
        />
      </form>
    </div>
  );
};

export default LoginForm;
