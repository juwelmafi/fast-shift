import React from "react";
import Marquee from "react-fast-marquee";

// List of brand logo image paths (relative to /public or src/assets)

import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/moonstar.png";
import logo5 from "../../../assets/brands//randstad.png";
import logo6 from "../../../assets/brands/start-people 1.png";
import logo7 from "../../../assets/brands/start.png";

const brandLogos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7]

const BrandSlider = () => {
  return (
    <section className=" py-10 border-b my-10 border-dotted border-gray-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[#003c3c] mb-10">
          We’ve helped thousands of sales teams
        </h3>
      </div>

      <Marquee
        direction="left"
        speed={50}
        pauseOnHover={true}
        gradient={false}
        className="flex items-center gap-8"
      >
        {brandLogos.map((logo, index) => (
          <div key={index} className="mx-12 w-34 flex items-center">
            <img
              src={logo}
              alt={`Brand ${index}`}
              className="h-10 object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default BrandSlider;
