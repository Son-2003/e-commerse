import { useState } from "react";

export default function ZoomImage({ image }: { image: string }) {
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setBackgroundPosition("center");
  };

  return (
    <div className="w-full sm:w-[80%] relative overflow-hidden">
      <img 
        src={image} 
        alt="" 
        className={`w-full h-auto transition-opacity duration-300 ${
          isHovering ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`absolute inset-0 transition-opacity duration-300 cursor-zoom-in ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "200%",
          backgroundPosition: backgroundPosition,
        }}
      />
    </div>
  );
}