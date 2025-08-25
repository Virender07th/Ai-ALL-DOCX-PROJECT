import React, { useState } from "react";
import Button from "../Reusable/Button"; // Import your custom Button

const ContactUs = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-4 flex justify-center items-center">
      <div className="w-full max-w-[960px] flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
          Contact Us
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm sm:text-base mb-8 text-center max-w-xl">
          We're here to help! Whether you have questions, feedback, or just want
          to chat about AI, reach out using the form below.
        </p>

        {/* Form */}
        <form
          onSubmit={SubmitHandler}
          className="flex flex-col items-center gap-4 w-full"
        >
          {["userName", "email"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field === "email" ? "Your Email" : "Your Name"}
              value={formData[field]}
              onChange={handleChange}
              className="w-full sm:w-[448px] h-[56px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          ))}

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full sm:w-[448px] h-[144px] px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
          />

          {/* Button using your custom component */}
          <div className="w-full sm:w-[448px] flex justify-center">
            <Button
              type="submit"
              content="Send Message"
              variant="primary"
              size="md"
              fullWidth={false}
            />
          </div>
        </form>

        {/* Footer Note */}
        <div className="text-sm text-gray-500 mt-6 text-center">
          We'll get back to you within 24 hours.
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
