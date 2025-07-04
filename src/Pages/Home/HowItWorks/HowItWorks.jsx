import React from 'react';
import { FaTruckPickup } from 'react-icons/fa';

const features = [
  {
    title: 'Booking Pick & Drop',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    title: 'Cash On Delivery',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    title: 'Delivery Hub',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    title: 'Booking SME & Corporate',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#F2F5F6] py-12 px-4 md:px-8 lg:px-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[#003c3c] mb-8">How it Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200"
          >
            <FaTruckPickup className="text-3xl text-[#00494d] mb-4" />
            <h3 className="text-[#00494d] font-semibold text-base md:text-lg mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
