import React from "react";
import { FiUpload, FiLink, FiPlayCircle, FiInfo } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

import Button from "../../Component/Reusable/Button";
import { ImageSlidingData } from "../../Data/feature";

const ImagePart = () => {
  return (
    <div className="w-full px-4 sm:px-6 py-8 flex flex-col items-center gap-16 max-w-[1100px] mx-auto">
      {/* Swiper Slider */}
      <div className="w-full relative rounded-xl overflow-hidden shadow-xl">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-[400px] sm:h-[500px] md:h-[600px]"
        >
          {ImageSlidingData.map((item, id) => (
            <SwiperSlide key={id}>
              <div className="relative w-full h-full">
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={`slide-${id}`}
                  className="absolute w-full h-full object-center object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/70 z-10" />

                {/* Text & CTA Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
                  <h1 className="text-white font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-snug mb-4 drop-shadow-md">
                    {item.heading}
                  </h1>
                  <p className="text-white text-sm sm:text-lg max-w-2xl drop-shadow-sm mb-8">
                    {item.content}
                  </p>

                  {/* CTA Buttons using Reusable Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                    <Button
                      content="Upload File"
                      icon={FiUpload}
                      condition={true}
                      data={true}
                      color={true}
                      style="max-w-[220px]"
                    />
                    <Button
                      content="Paste URL"
                      icon={FiLink}
                      condition={true}
                      data={true}
                      color={false}
                      style="max-w-[220px]"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Secondary Buttons */}
      <div className="flex flex-col justify-center items-center sm:flex-row gap-4 z-30 w-full max-w-md  -mb-10 sm:m-1">
        <Button
          content="Try with Sample"
          icon={FiPlayCircle}
          data={true}
          condition={true}
          color={true}
          style="max-w-[220px]"

                  />
        <Button
          content="Learn More"
          icon={FiInfo}
          data={true}
          condition={true}
          color={false}
          style="max-w-[220px]"
          
        />
      </div>
    </div>
  );
};

export default ImagePart;
