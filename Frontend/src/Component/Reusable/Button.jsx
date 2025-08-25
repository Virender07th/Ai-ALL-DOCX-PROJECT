import React from "react";

const Button = ({
  type = "button",
  variant = "primary", // primary, secondary, outline, ghost, danger
  size = "md", // sm, md, lg
  content = "Submit",
  data = true,
  condition = true,
  click,
  loading = false,
  style = "",
  icon: Icon,
  iconPosition = "left", // left, right
  fullWidth = false,
}) => {
  const isDisabled = !data || !condition;

const variantStyles = {
  primary: `
    bg-gradient-to-r from-blue-500 to-cyan-500
    text-white font-semibold
    shadow-sm
    hover:from-blue-600 hover:to-cyan-600 hover:shadow-md
    active:from-blue-700 active:to-cyan-700 active:shadow-sm
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:from-blue-300 disabled:to-cyan-300 disabled:cursor-not-allowed disabled:shadow-none
    transition-all duration-200
  `,
  
  secondary: `
    bg-gradient-to-r from-blue-50 to-cyan-50
    text-blue-700 font-medium
    border border-blue-200
    shadow-sm
    hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 hover:shadow-md
    active:from-blue-200 active:to-cyan-200 active:shadow-sm
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:from-blue-50 disabled:to-cyan-50 disabled:text-blue-400 disabled:cursor-not-allowed
    transition-all duration-200
  `,
  
  outline: `
    bg-white
    text-slate-700 font-medium
    border border-slate-300
    shadow-sm
    hover:bg-slate-50 hover:border-slate-400 hover:shadow-md
    active:bg-slate-100 active:border-slate-500 active:shadow-sm
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed
    transition-all duration-200
  `,
  
  ghost: `
    bg-transparent
    text-slate-600 font-medium
    hover:bg-slate-100 hover:text-slate-800
    active:bg-slate-200
    focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
    disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:bg-transparent
    transition-all duration-200
  `,
  
  danger: `
    bg-gradient-to-r from-red-500 to-red-600
    text-white font-semibold
    shadow-sm
    hover:from-red-600 hover:to-red-700 hover:shadow-md
    active:from-red-700 active:to-red-800 active:shadow-sm
    focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    disabled:from-red-300 disabled:to-red-400 disabled:cursor-not-allowed disabled:shadow-none
    transition-all duration-200
  `,
  
  success: `
    bg-gradient-to-r from-emerald-500 to-emerald-600
    text-white font-semibold
    shadow-sm
    hover:from-emerald-600 hover:to-emerald-700 hover:shadow-md
    active:from-emerald-700 active:to-emerald-800 active:shadow-sm
    focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
    disabled:from-emerald-300 disabled:to-emerald-400 disabled:cursor-not-allowed disabled:shadow-none
    transition-all duration-200
  `,
  
  warning: `
    bg-gradient-to-r from-amber-500 to-amber-600
    text-white font-semibold
    shadow-sm
    hover:from-amber-600 hover:to-amber-700 hover:shadow-md
    active:from-amber-700 active:to-amber-800 active:shadow-sm
    focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
    disabled:from-amber-300 disabled:to-amber-400 disabled:cursor-not-allowed disabled:shadow-none
    transition-all duration-200
  `
};

// Optional: Size variants for additional flexibility
const sizeStyles = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-3.5 text-lg'
};
  const baseStyle = `
    flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none
    relative overflow-hidden
    ${fullWidth ? "w-full" : "w-auto"}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${isDisabled || loading 
      ? "opacity-50 cursor-not-allowed pointer-events-none" 
      : "cursor-pointer"
    }
  `;

  return (
    <button
      type={type}
      disabled={isDisabled || loading}
      onClick={click}
      className={`${baseStyle} ${style}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
          <span className="truncate">{content}</span>
          {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
        </>
      )}
    </button>
  );
};

export default Button;