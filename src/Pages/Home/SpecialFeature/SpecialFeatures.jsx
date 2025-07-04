import React from "react";

import featImage1 from "../../../assets/live-tracking.png"
import featImage3 from "../../../assets/safe-delivery.png"
import featImage2 from "../../../assets/big-deliveryman.png"

// Feature data
const features = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
    image: featImage1, // Replace with your image
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: featImage2, // Replace with your image
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: featImage3, // Replace with your image
  },
];

const SpecialFeatures = () => {
  return (
    <section className="bg-[#f2f4f6] py-10 px-4 lg:px-0">
      <div className="max-w-6xl mx-auto space-y-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10 shadow-sm"
          >
            {/* Image section */}
            <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-34 md:w-48 h-auto object-contain"
              />
            </div>

            {/* Vertical divider */}
           <div className="hidden md:block self-stretch w-px border-l border-dotted border-gray-400" />

            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-[#003c3c] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialFeatures;
