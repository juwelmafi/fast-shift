import React from "react";

import locatiionMarchant from "../../../assets/location-merchant.png";

const BeMarchant = () => {
  return (
    <div
      data-aos="fade-up"
      className=" max-w-6xl bg-[url(assets/be-a-merchant-bg.png)] mx-auto bg-[#03373D] rounded-3xl my-10 bg-no-repeat"
    >
      <div className=" flex justify-between items-center  w-full lg:flex-row-reverse flex-col p-10">
        <img src={locatiionMarchant} className="" />
        <div className="w-1/2">
          <h1 className="text-3xl font-bold text-white">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6 text-white">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn btn-primary rounded-full text-black">
            Become A Merchant
          </button>
          <button className="btn btn-primary rounded-full btn-outline ml-2 text-primary hover:text-black">
            Earn with Profast Courier
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMarchant;
