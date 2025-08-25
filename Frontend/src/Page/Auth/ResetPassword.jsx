import React, { useState } from "react";
import { Lock } from "lucide-react";
import InputField from "../../Component/Reusable/InputField";
import Button from "../../Component/Reusable/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../Service/Operations/AuthAPI";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const { token } = useParams(); 



  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPassword(formData.password, formData.confirmPassword, token, navigate));
  };

  const isValid =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-gray-600">
            Enter your new password below
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded"></div>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">
          <InputField
            label="New Password"
            placeholder="Enter new password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChangeHandler}
            required
            
          />

          <InputField
            label="Confirm Password"
            placeholder="Confirm new password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChangeHandler}
            required
          
          />

          <Button
            type="submit"
            content="Reset password"
            variant="primary"
            size="md"
            fullWidth
            condition={isValid}
            click={submitHandler}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
