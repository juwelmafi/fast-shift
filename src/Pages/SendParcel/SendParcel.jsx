import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthContext/AuthContexts";
import useAxiosSecurity from "../../hooks/useAxiosSecurity";
import { Toaster } from "react-hot-toast";

const AddParcelForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const parcelType = watch("type");

  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecurity();

  // for select locations and serivce center code //
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetch("./warehouses.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");

  const uniqueRegions = [...new Set(locations.map((loc) => loc.region))];

  const getDistrictsByRegion = (region) => {
    // Filter locations by region and return unique city names
    const districts = locations
      .filter((loc) => loc.region === region)
      .map((loc) => loc.city);

    // Remove duplicates (optional, but safe)
    return [...new Set(districts)];
  };
  //form related codes//
  const onSubmit = (data) => {
    const userEmail = user?.email || "unknown@email.com";

    let cost = 0;
    const weight = parseFloat(data.weight) || 0;
    const isSameCity = data.sender_region === data.receiver_region;
    let costDetails = "";

    if (data.type === "document") {
      cost = isSameCity ? 60 : 80;
      costDetails = isSameCity
        ? "Document (Same City): ৳60"
        : "Document (Outside City): ৳80";
    } else {
      if (weight <= 3) {
        cost = isSameCity ? 110 : 150;
        costDetails = isSameCity
          ? `Non-Document (≤3kg, Same City): ৳110`
          : `Non-Document (≤3kg, Outside City): ৳150`;
      } else {
        const extraKg = weight - 3;
        const baseCost = isSameCity ? 110 : 150;
        const extraCost = extraKg * 40;
        const outsideCityExtra = isSameCity ? 0 : 40;
        cost = baseCost + extraCost + outsideCityExtra;

        costDetails = `
        Non-Document (>3kg):
        Base Cost (3kg): ৳${baseCost}
        Extra ${extraKg.toFixed(1)}kg × 40 = ৳${extraCost}
        ${!isSameCity ? "Outside City Extra: ৳40" : ""}
        ---------------------
        Total = ৳${cost}
      `;
      }
    }
    const tracking_id = `FS-${Date.now().toString(36).toUpperCase()}`;

    const fullFormData = {
      ...data,
      created_by: userEmail,
      creation_date: new Date().toISOString(),
      cost,
      payment_status: "unpaid",
      delivety_status: "not_collected",
      tracking_id,
    };

    Swal.fire({
      title: "Confirm Booking",
      html: `<div style="text-align:left;"><strong>Cost Breakdown:</strong><br><pre>${costDetails}</pre></div>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm & Send",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Saving to DB:", fullFormData);

        axiosSecure.post("/parcels", fullFormData).then((res) => {
          console.log(res.data);
          if (res?.data?.insertedId) {
            //TODO: Redirect to the payment page
            Swal.fire({
              title: "Redirecting...",
              text: "Processing to payment gateway.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });

        reset();
      }
    });
  };

  return (
    <div className=" w-5xl mx-auto p-6 bg-base-100 my-10 rounded-xl">
      <Toaster />
      <h2 className="text-2xl font-bold mb-1">Add New Parcel</h2>
      <p className="mb-6 text-gray-600">
        Fill out the form below to submit a delivery parcel.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Parcel Info */}
        <fieldset className=" p-4 rounded col-span-full">
          <legend className="font-semibold text-lg mb-2">Parcel Info</legend>

          <div className="flex gap-4 mb-4">
            <label>
              <input
                type="radio"
                value="document"
                {...register("type", { required: true })}
              />
              <span className="ml-2">Document</span>
            </label>
            <label>
              <input
                type="radio"
                value="non-document"
                {...register("type", { required: true })}
              />
              <span className="ml-2">Non-Document</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Title</label>
              <input
                {...register("title", { required: true })}
                className="input ml-2"
                placeholder="Your parcel title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Title is required</p>
              )}
            </div>

            <div>
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register("weight")}
                className="input ml-2"
                disabled={parcelType === "document" && true}
                placeholder="Parcel weight"
              />
            </div>
          </div>
          <hr className="mt-10 text-gray-300" />
        </fieldset>

        <div className="grid grid-cols-2 col-span-full gap-5">
          {/* Sender Info */}
          <fieldset className=" p-4 rounded">
            <legend className="font-semibold text-lg mb-2">Sender Info</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Sender Name"
                {...register("sender_name", { required: true })}
                className="input"
              />
              <input
                placeholder="Sender Contact"
                {...register("sender_contact", { required: true })}
                className="input"
              />
              {/* Region Dropdown */}
              <select
                className="select w-full"
                {...register("sender_region", { required: true })}
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region, idx) => (
                  <option key={idx} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              {/* Service Center Dropdown (filtered) */}
              <select
                {...register("sender_service_center", { required: true })}
                disabled={!senderRegion}
                className="select w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(senderRegion).map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <input
                placeholder="Sender Address"
                {...register("sender_address", { required: true })}
                className="input col-span-full w-full"
              />
              <textarea
                placeholder="Pickup Instruction"
                {...register("pickup_instruction", { required: true })}
                className="textarea col-span-full w-full"
              />
            </div>
          </fieldset>

          {/* Receiver Info */}
          <fieldset className=" p-4 rounded">
            <legend className="font-semibold text-lg  mb-2">
              Receiver Info
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Receiver Name"
                {...register("receiver_name", { required: true })}
                className="input"
              />
              <input
                placeholder="Receiver Contact"
                {...register("receiver_contact", { required: true })}
                className="input"
              />
              {/* Region Dropdown */}
              <select
                className="select w-full"
                {...register("receiver_region", { required: true })}
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region, idx) => (
                  <option key={idx} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {/* Service Center Dropdown (filtered) */}
              <select
                {...register("receiver_service_center", { required: true })}
                disabled={!receiverRegion}
                className="select w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(receiverRegion).map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <input
                placeholder="Receiver Address"
                {...register("receiver_address", { required: true })}
                className="input col-span-full w-full"
              />
              <textarea
                placeholder="Delivery Instruction"
                {...register("delivery_instruction", { required: true })}
                className="textarea col-span-full w-full"
              />
            </div>
          </fieldset>
        </div>

        <div className="col-span-full flex justify-end">
          <button type="submit" className="btn btn-primary text-black">
            Proceed to confirm booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParcelForm;
