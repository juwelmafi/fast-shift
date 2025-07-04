import React, { useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import locationData from "../../assets/warehouses.json";
import rider from "../../assets/agent-pending.png";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecurity from "../../hooks/useAxiosSecurity";

const BeARider = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm();

  const [selectedRegion, setSelectedRegion] = useState("");
  const axiosSecure = useAxiosSecurity();
  const onSubmit = (data) => {
    const riderData = {
      ...data,
      name: user?.displayName || "",
      email: user?.email || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };
    console.log(riderData);

    // send data to backend here

    axiosSecure.post("/riders", riderData).then((res) => {
      console.log(res.data)
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your request to be a rider has been received.",
        });
      }
    });
  };

  // Get unique regions
  const uniqueRegions = useMemo(() => {
    const regions = locationData.map((item) => item.region);
    return [...new Set(regions)];
  }, []);

  // Get districts under selected region
  const filteredDistricts = useMemo(() => {
    if (!selectedRegion) return [];
    return locationData
      .filter((item) => item.region === selectedRegion)
      .map((item) => item.district);
  }, [selectedRegion]);

  return (
    <div className=" my-10 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-6xl p-10 flex flex-col md:flex-row gap-10">
        {/* Left: Text + Form */}
        <div className="w-full md:w-1/2">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-[#043f2e] mb-2">Be a Rider</h2>
          <p className="text-gray-600 mb-8">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={user?.displayName || ""}
                readOnly
                {...register("name")}
                className="input input-bordered w-full bg-[#f5f5f5] shadow-sm"
              />
              <input
                type="text"
                placeholder="Your age"
                {...register("age")}
                className="input input-bordered w-full bg-[#f5f5f5] shadow-sm"
              />
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                {...register("email")}
                className="input input-bordered w-full bg-[#f5f5f5] shadow-sm"
              />
              <select
                {...register("region")}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setValue("region", e.target.value);
                  setValue("warehouse", ""); // Reset warehouse when region changes
                }}
                className="select select-bordered w-full bg-[#f5f5f5] shadow-sm"
              >
                <option disabled selected>
                  Select your region
                </option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="NID No"
                {...register("nid")}
                className="input input-bordered w-full bg-[#f5f5f5] shadow-sm"
              />
              <input
                type="text"
                placeholder="Contact"
                {...register("contact")}
                className="input input-bordered w-full bg-[#f5f5f5] shadow-sm"
              />
              <select
                {...register("warehouse")}
                disabled={!selectedRegion}
                className="select select-bordered w-full bg-[#f5f5f5] shadow-sm md:col-span-2"
              >
                <option disabled selected>
                  {selectedRegion
                    ? "Select warehouse (district)"
                    : "Select region first"}
                </option>
                {filteredDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn bg-[#c7f046] text-black hover:bg-lime-400 font-semibold px-6"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img src={rider} alt="Rider" className="w-[300px] h-auto" />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
