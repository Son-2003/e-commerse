import React from "react";
import img1 from "../assets/carousel/carousel_1.jpg";
import img2 from "../assets/carousel/carousel_2.jpg";
import img3 from "../assets/carousel/carousel_3.jpg";
import img4 from "../assets/carousel/carousel_4.jpg";
import img5 from "../assets/carousel/carousel_5.jpg";

const images = [img1, img2, img3, img4, img5];

export default function FashionCarousel() {
  return (
    <div className="overflow-hidden w-full bg-white mt-20">
      <div className="flex animate-slide-group">
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="w-[20vw] h-[40vh] flex-shrink-0 flex justify-center items-center"
          >
            <img
              src={src}
              alt={`fashion-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
