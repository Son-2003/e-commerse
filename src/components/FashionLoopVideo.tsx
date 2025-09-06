import Marquee from "react-fast-marquee";
import fashionVideo from "../assets/videos/fashion.mp4";
import { useNavigate } from "react-router-dom";

const FashionLoopVideo = () => {
  const items = Array.from({ length: 30 }, () => "// FOREVER");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/collection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        src={fashionVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-gallisia tracking-widest mb-6 animate-fadeIn">
          NEW SEASON
        </h1>
        <p className="text-lg md:text-2xl font-light tracking-[0.3em] mb-8 animate-fadeIn delay-200">
          Discover the Future of Fashion
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-6 justify-center">
          <button
            onClick={handleClick}
            className="group relative px-12 py-4 bg-transparent border border-white/30 text-white font-light tracking-wider overflow-hidden transition-all duration-500 hover:border-white"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              DISCOVER
            </span>
            <div className="absolute inset-0 bg-white transform translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
          </button>

          <button
            onClick={handleClick}
            className="group relative px-12 py-4 bg-transparent border border-white/30 text-white font-light tracking-wider overflow-hidden transition-all duration-500 hover:border-white"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              EXPLORE
            </span>
            <div className="absolute inset-0 bg-white transform translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
          </button>
        </div>
      </div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 w-full">
        <Marquee
          gradient={false}
          speed={50}
          className="bg-black/60 text-white py-3"
        >
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
    </section>
  );
};

export default FashionLoopVideo;
