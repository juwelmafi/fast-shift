import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity"; // adjust the path if needed

import Swal from "sweetalert2";
import Loading from "../../shared/Loading/Loading";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecurity();

  const {
    data: riders = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleAccept = async (id, email) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this rider?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/status/${id}`, {
          status: "active",
          email,
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire("Accepted!", "Rider has been approved.", "success");
          refetch();
        }
      } catch (err) {
        Swal.fire("Error!", "Could not approve rider.", err);
      }
    }
  };

  const handleReject = async (id, email) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/status/${id}`, {
          status: "rejected",
          email,
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire("Rejected!", "Rider has been rejected.", "info");
          refetch();
        }
      } catch (err) {
        Swal.fire("Error!", "Could not reject rider.", err);
      }
    }
  };

  const handleDetails = (rider) => {
    Swal.fire({
      title: rider.name,
      html: `
        <p><strong>Email:</strong> ${rider.email}</p>
        <p><strong>Age:</strong> ${rider.age}</p>
        <p><strong>NID:</strong> ${rider.nid}</p>
        <p><strong>Region:</strong> ${rider.region}</p>
        <p><strong>Contact:</strong> ${rider.contact}</p>
        <p><strong>Warehouse:</strong> ${rider.warehouse}</p>
        <p><strong>Phone:</strong> ${rider.phone || "N/A"}</p>
        <p><strong>Applied At:</strong> ${new Date(
          rider.created_at
        ).toLocaleString()}</p>
      `,
      icon: "info",
    });
  };

  if (isPending) return <Loading></Loading>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pending Riders</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Region</th>
            <th>Warehouse</th>
            <th>Applied At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {riders.map((rider, index) => (
            <tr key={rider._id}>
              <td>{index + 1}</td>
              <td>{rider.name}</td>
              <td>{rider.email}</td>
              <td>{rider.region}</td>
              <td>{rider.warehouse || "N/A"}</td>
              <td>{new Date(rider.created_at).toLocaleDateString()}</td>
              <td className="space-x-2">
                <button
                  onClick={() => handleDetails(rider)}
                  className="btn btn-sm btn-info"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleAccept(rider._id, rider.email)}
                  className="btn btn-sm btn-success"
                  title="Accept"
                >
                  <FaCheckCircle />
                </button>
                <button
                  onClick={() => handleReject(rider._id, rider.email)}
                  className="btn btn-sm btn-error"
                  title="Reject"
                >
                  <FaTimesCircle />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRiders;
