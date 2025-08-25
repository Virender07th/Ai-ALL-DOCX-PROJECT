import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import InputField from '../../Component/Reusable/InputField';
import Button from '../../Component/Reusable/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgetPassword } from '../../Service/Operations/AuthAPI';

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
  e.preventDefault();
  alert("Email submitted: " + email);
  dispatch(forgetPassword(email, navigate));
};


  const handleResend = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot your password?
          </h1>
          <p className="text-sm text-gray-600">
            Enter the email address associated with your account, and we'll send you a link to reset your password.
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded"></div>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="md"
          />

          <Button
            type="submit"
            data={email}
            condition={!!email}
            content="Send reset link"
            variant="primary"
            size="md"
            fullWidth
          />
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Button
            type="button"
            content="Back to login"
            click={handleResend}
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            iconPosition="left"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
