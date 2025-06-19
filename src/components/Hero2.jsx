import React from "react";
import { assets } from "../assets/assets";
import Marquee from "react-fast-marquee";

const Hero = () => {
  const items = Array.from({ length: 30 }, (_, index) => "// FOREVER ");

  return (
    <div>
      <div className="flex flex-col sm:flex-row border-2">
        <img className="w-full sm:w-1/2" src={assets.hero_img} alt="" />

        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <div className="text-[#414141]">
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
              <p className="font-medium text-sm md:text-base">
                OUR BESTSELLERS
              </p>
            </div>
            <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed">
              Latest Arrivals
            </h1>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm md:text-base">SHOP NOW</p>
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            </div>
          </div>
        </div>
      </div>
      <Marquee gradient={false} speed={50} className="bg-gray-200">
        <div className="space-x-8 flex">
          {items.map((item, index) => (
            <p
              key={index}
              className="text-lg font-light tracking-[0.3em] font-gallisia"
            >
              {item}&nbsp;
            </p>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default Hero;
