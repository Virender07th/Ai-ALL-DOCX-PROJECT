// Simple button component
const createButton = (url, text) => `
<div style="margin: 25px 0; text-align: center;">
  <a href="${url}" 
     style="background-color: #007bff; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 4px; 
            display: inline-block; 
            font-weight: 500;">
    ${text}
  </a>
</div>
`;

// Password Reset Request Template
export const forgotPasswordTemplate = (email, resetUrl) => `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
  <h2 style="color: #333; margin: 0 0 20px 0; font-weight: 500;">Password Reset Request</h2>
  
  <p>Hello ${email},</p>
  
  <p>We received a request to reset your password. Click the button below to reset it:</p>
  
  ${createButton(resetUrl, "Reset Password")}
  
  <p>Or copy and paste this link into your browser:</p>
  <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all; font-size: 14px;">
    ${resetUrl}
  </p>
  
  <p><strong>This link will expire in 15 minutes.</strong></p>
  
  <p>If you didn't request this, you can safely ignore this email.</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888; margin: 0;">
    © ${new Date().getFullYear()} Your Company. All rights reserved.
  </p>
</div>
`;

// Password Reset Success Template
export const resetPasswordSuccessTemplate = (userName) => `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
  <h2 style="color: #28a745; margin: 0 0 20px 0; font-weight: 500;">Password Reset Successful</h2>
  
  <p>Hello ${userName},</p>
  
  <p>Your password has been successfully reset. You can now log in with your new password.</p>
  
  <p style="background-color: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107;">
    <strong>Important:</strong> If you did not perform this action, please contact our support team immediately.
  </p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888; margin: 0;">
    © ${new Date().getFullYear()} Your Company. All rights reserved.
  </p>
</div>
`;

// Change Password Template
export const changePasswordTemplate = (userName) => `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
  <h2 style="color: #333; margin: 0 0 20px 0; font-weight: 500;">Password Changed</h2>
  
  <p>Hello ${userName},</p>
  
  <p>Your account password has been successfully changed.</p>
  
  <p style="background-color: #f8d7da; padding: 15px; border-radius: 4px; border-left: 4px solid #dc3545;">
    <strong>Security Alert:</strong> If you didn't make this change, please reset your password immediately and contact support.
  </p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888; margin: 0;">
    © ${new Date().getFullYear()} Your Company. All rights reserved.
  </p>
</div>
`;

// OTP Template
export const otpTemplate = (otp) => `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
  <h2 style="color: #333; margin: 0 0 20px 0; font-weight: 500; text-align: center;">Your Verification Code</h2>
  
  <p style="text-align: center;">Use this code to complete your verification:</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <div style="display: inline-block; 
                background-color: #f8f9fa; 
                border: 2px solid #007bff; 
                color: #007bff; 
                font-size: 32px; 
                font-weight: bold; 
                padding: 15px 25px; 
                border-radius: 8px; 
                letter-spacing: 4px;
                font-family: monospace;">
      ${otp}
    </div>
  </div>
  
  <p style="text-align: center;"><strong>This code expires in 5 minutes.</strong></p>
  
  <p style="background-color: #d1ecf1; padding: 15px; border-radius: 4px; border-left: 4px solid #17a2b8; text-align: center;">
    <strong>Security Notice:</strong> Do not share this code with anyone.
  </p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888; margin: 0;">
    © ${new Date().getFullYear()} Your Company. All rights reserved.
  </p>
</div>
`;
