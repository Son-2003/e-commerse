import { assets } from "../assets/assets";
import Marquee from "react-fast-marquee";

const Hero2 = () => {
  const items = Array.from({ length: 20 }, () => "// FOREVER");

  return (
    <section className="relative w-full">
      {/* Hero Content */}
      <div className="flex flex-col sm:flex-row">
        {/* Left Image */}
        <div className="relative w-full sm:w-2/3">
          <img
            src={assets.hero_img}
            alt="hero"
            className="w-full h-[70vh] sm:h-[90vh] object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Right Content */}
        <div className="w-full sm:w-1/3 flex items-center justify-center bg-white px-6 sm:px-10 py-12 sm:py-0">
          <div className="text-center sm:text-left space-y-6">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-10 h-[2px] bg-gray-800"></span>
              <p className="font-medium text-sm md:text-base text-gray-700">
                OUR BESTSELLERS
              </p>
            </div>

            <h1 className="text-4xl lg:text-6xl font-gallisia tracking-wide leading-tight text-gray-900">
              Latest <br /> Arrivals
            </h1>

            <button className="mt-4 px-8 py-3 border border-gray-800 text-gray-900 font-medium tracking-wide rounded-full hover:bg-black hover:text-white transition">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full">
        <Marquee
          gradient={false}
          speed={60}
          className="bg-black/60 text-white py-3"
        >
          <div className="space-x-8 flex">
            {items.map((item, index) => (
              <p
                key={index}
                className="text-lg font-light tracking-[0.3em] font-gallisia"
              >
                {item}
              </p>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
};

export default Hero2;
