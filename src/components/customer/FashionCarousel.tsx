import img1 from "../../assets/carousel/carousel_1.jpg";
import img2 from "../../assets/carousel/carousel_2.jpg";
import img3 from "../../assets/carousel/carousel_3.jpg";
import img4 from "../../assets/carousel/carousel_4.jpg";
import img5 from "../../assets/carousel/carousel_5.jpg";

const images = [img1, img2, img3, img4, img5];

export default function FashionCarousel() {
  return (
    <div className="overflow-hidden w-full bg-white mt-10 sm:mt-16 lg:mt-20">
      <div className="flex animate-slide-group">
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="
              flex-shrink-0 flex justify-center items-center
              basis-1/2 h-40
              sm:basis-1/3 sm:h-52
              md:basis-1/4 md:h-64
              lg:basis-1/5 lg:h-72
            "
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
