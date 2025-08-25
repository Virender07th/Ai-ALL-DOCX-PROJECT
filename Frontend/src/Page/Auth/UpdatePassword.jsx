import React, { useState } from "react";
import { Settings as SettingsIcon, X } from "lucide-react";
import InputField from "../../Component/Reusable/InputField";
import Button from "../../Component/Reusable/Button";
import { useDispatch , useSelector} from "react-redux";
import { changePassword } from "../../Service/Operations/ProfileAPI";

const UpdatePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const {password ,newPassword, confirmPassword  } = formData;

  const { token } = useSelector((state) => state.auth);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Update password with:", formData);
    dispatch(changePassword(token , formData) );

    onClose(); // Close modal after update
  };

  const isValid =
    formData.password &&
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-gray-100 relative max-h-[90vh] overflow-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Change your password
          </h1>
          <p className="text-sm text-gray-600">Update your account password</p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded"></div>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
           <InputField
            label="Current Password"
            placeholder="Current  password"
            name="password"
            type="password"
            onChange={onChangeHandler}
            value={formData.password}
            required
          />

          <InputField
            label="New Password"
            placeholder="Enter new password"
            name="newPassword"
            type="password"
            onChange={onChangeHandler}
            value={formData.newPassword}
            required
          />

          <InputField
            label="Confirm New Password"
            placeholder="Confirm new password"
            name="confirmPassword"
            type="password"
            onChange={onChangeHandler}
            value={formData.confirmPassword}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              content="Cancel"
              variant="secondary"
              size="md"
              fullWidth
              click={onClose}
            />
            <Button
              type="submit"
              content="Update Password"
              variant="primary"
              size="md"
              fullWidth
              condition={isValid}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
