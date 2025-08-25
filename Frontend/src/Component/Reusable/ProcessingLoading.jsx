import React, { useEffect, useState } from "react";

const ProcessingLoading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // update every 50ms

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[1280px] h-[800px] bg-white flex justify-center items-center">
      <div className="w-[960px] h-[760px] max-w-[960px] pt-5 pb-5 bg-gray-100 rounded-xl shadow-md">
        <div className="pt-5 px-4 pb-3">
          <h1 className="font-bold font-lexend text-3xl">
            Processing your request
          </h1>
        </div>

        <div className="flex flex-col w-[960px] gap-2 p-4">
          <p className="font-lexend font-semibold text-lg">AI is working hard</p>

          {/* Dynamic Progress Bar */}
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 transition-all animate-pulse duration-200 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-[#667582] font-lexend font-normal">
            This may take a few minutes ({progress}%)
          </p>
        </div>

        <div className="w-[960px] h-[40px] pt-1 pr-4 pb-3 pl-4">
          <p className="text-[#121417] text-center font-lexend text-base">
            Please do not close or refresh this page. We'll notify you when it's ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingLoading;
