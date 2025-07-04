import React from "react";
import {
  FaShippingFast,
  FaMapMarkedAlt,
  FaWarehouse,
  FaMoneyBillWave,
  FaBuilding,
  FaUndoAlt,
  FaBoxOpen,
} from "react-icons/fa";

const ServiceCard = ({ service }) => {
  const { title, description } = service;

  const getIcon = (title) => {
    if (title.includes("Express")) return <FaShippingFast className="text-2xl text-[#fd5c5c]" />;
    if (title.includes("Nationwide")) return <FaMapMarkedAlt className="text-2xl text-[#fd5c5c]" />;
    if (title.includes("Fulfillment")) return <FaWarehouse className="text-2xl text-[#fd5c5c]" />;
    if (title.includes("Cash")) return <FaMoneyBillWave className="text-2xl text-[#fd5c5c]" />;
    if (title.includes("Corporate")) return <FaBuilding className="text-2xl text-[#fd5c5c]" />;
    if (title.includes("Return")) return <FaUndoAlt className="text-2xl text-[#fd5c5c]" />;
    return <FaBoxOpen />;
  };

  return (
    <div
      className={
        "card shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:bg-lime-200 hover:text-black bg-white text-black"
      }
    >
      <div className="card-body items-center text-center">
        <div className="bg-pink-100 rounded-full p-4 mb-4">
          {getIcon(title)}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
