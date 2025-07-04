import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBan } from "react-icons/fa";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity"; // adjust path
import Loading from "../../shared/Loading/Loading";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecurity();

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to deactivate this rider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/status/${id}`, {
          status: "deactivated",
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire("Deactivated!", "Rider has been deactivated.", "success");
          refetch();
        }
      } catch (err) {
        Swal.fire("Error!", "Could not deactivate rider.", err);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">Active Riders</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Region</th>
            <th>Warehouse</th>
            <th>Status</th>
            <th>Deactivate</th>
          </tr>
        </thead>
        <tbody>
          {riders.map((rider, index) => (
            <tr key={rider._id}>
              <td>{index + 1}</td>
              <td>{rider.name}</td>
              <td>{rider.email}</td>
              <td>{rider.region || "N/A"}</td>
              <td>{rider.warehouse || "N/A"}</td>
              <td>
                <span className="badge badge-success">{rider.status}</span>
              </td>
              <td>
                <button
                  onClick={() => handleDeactivate(rider._id)}
                  className="btn btn-sm btn-error"
                  title="Deactivate"
                >
                  <FaBan />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveRiders;
