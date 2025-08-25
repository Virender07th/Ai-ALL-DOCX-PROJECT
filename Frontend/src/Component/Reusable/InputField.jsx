import React, { useState } from "react";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheck } from "react-icons/fi";

const InputField = ({
  label,
  type = "text",
  size = "md", // sm, md, lg
  variant = "default", // default, success, error
  placeholder,
  value,
  onChange,
  icon: Icon = null,
  iconPosition = "left", // "left" or "right"
  error = "",
  success = "",
  helperText = "",
  required = false,
  disabled = false,
  style = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const hasError = error && error.length > 0;
  const hasSuccess = success && success.length > 0;

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-2 text-sm h-9",
    md: "px-3 py-3 text-sm h-11",
    lg: "px-4 py-4 text-base h-12",
  };

  // Variant styles inspired by sidebar
  const getVariantStyles = () => {
    if (hasError) {
      return `
        border-red-300 bg-red-50
        focus:ring-2 focus:ring-red-500 focus:border-red-500
        text-red-900 placeholder-red-400
      `;
    }
    if (hasSuccess) {
      return `
        border-green-300 bg-green-50
        focus:ring-2 focus:ring-green-500 focus:border-green-500
        text-green-900 placeholder-green-400
      `;
    }
    if (isFocused) {
      return `
        border-blue-300 bg-gradient-to-r from-blue-50/50 to-purple-50/50
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        text-gray-900 placeholder-gray-400
      `;
    }
    return `
        border-2 border-gray-200 bg-white 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      hover:border-gray-300
      text-gray-900 placeholder-gray-400
    `;
  };

  const baseInputStyle = `
    w-full rounded-xl
    font-medium
    transition-all duration-200
    focus:outline-none
    ${sizeStyles[size]}
    ${getVariantStyles()}
    ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
    ${Icon && iconPosition === "left" ? "pl-10" : ""}
    ${Icon && iconPosition === "right" ? "pr-10" : ""}
    ${isPassword && value ? "pr-10" : ""}
  `;

  return (
    <div className={`flex flex-col w-full gap-1.5 ${style}`}>
      {label && (
        <div className="flex items-center gap-1">
          <label className="text-sm font-semibold text-gray-800">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}

      <div className="relative group">
        {Icon && iconPosition === "left" && (
          <span className={`
            absolute inset-y-0 left-3 flex items-center 
            transition-colors duration-200
            ${hasError ? "text-red-500" : hasSuccess ? "text-green-500" : isFocused ? "text-blue-500" : "text-gray-400"}
          `}>
            <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
          </span>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={baseInputStyle}
          {...props}
        />

        {Icon && iconPosition === "right" && !isPassword && (
          <span className={`
            absolute inset-y-0 right-3 flex items-center 
            transition-colors duration-200
            ${hasError ? "text-red-500" : hasSuccess ? "text-green-500" : isFocused ? "text-blue-500" : "text-gray-400"}
          `}>
            <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
          </span>
        )}

        {isPassword && value && (
          <span
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <FiEyeOff size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
            ) : (
              <FiEye size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
            )}
          </span>
        )}

        {hasError && (
          <span className="absolute inset-y-0 right-3 flex items-center text-red-500">
            {/* <FiAlertCircle size={size === "sm" ? 16 : size === "lg" ? 20 : 18} /> */}
          </span>
        )}

        {hasSuccess && (
          <span className="absolute inset-y-0 right-3 flex items-center text-green-500">
            <FiCheck size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
          </span>
        )}
      </div>

      {/* Helper text, error, or success message */}
      {(helperText || error || success) && (
        <div className="flex items-start gap-1.5 px-1">
          {hasError && (
            <>
              <FiAlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </>
          )}
          {hasSuccess && !hasError && (
            <>
              <FiCheck size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-600 font-medium">{success}</p>
            </>
          )}
          {helperText && !hasError && !hasSuccess && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InputField;