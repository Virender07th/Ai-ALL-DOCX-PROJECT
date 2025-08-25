import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageNotFoundImage from "../../assets/PageNotFoundImage.png";

const PageNotFound = () => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(-1); // or use navigate("/") to go to homepage
  };

  return (
    <div className="flex flex-col items-center justify-center h-fit w-full bg-white overflow-hidden mt-10">
      <div className="w-full max-w-[960px] text-center px-4">
        <h1 className="text-4xl font-bold text-[#121417] font-lexend mb-3">
          Page not found
        </h1>
        <p className="text-[#121417] font-lexend mb-5">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <img
          src={PageNotFoundImage}
          alt="Page Not Found"
          className="max-w-full h-[450px] object-contain mx-auto rounded-3xl mb-6"
        />
        <button
          className="bg-[#1A7DE5] text-white font-bold font-lexend px-6 py-2 rounded-2xl hover:bg-blue-600 transition duration-200"
          onClick={clickHandler}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
