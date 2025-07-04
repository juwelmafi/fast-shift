import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import { FaEye, FaEdit, FaTrash, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecurity();
  const navigate = useNavigate();


  // Fetch parcels
  const { data, refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-parcels?email=${user?.email}`);
      return res.data;
    },
  });

  const parcels = data?.data;

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);
        if (res?.data?.deletedCount === 1) {
          Swal.fire("Deleted!", "Parcel has been deleted.", "success");
          refetch();
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  // Handle pay
  const handlePay = async (id) => {
    navigate(`/dashboard/payment/${id}`)
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="table table-zebra w-full">
        {/* Table Head */}
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Created</th>
            <th>Cost (৳)</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {parcels?.map((parcel, index) => (
            <tr key={parcel._id}>
              <th>{index + 1}</th>
              <td
                className="capitalize truncate max-w-[150px]"
                title={parcel.title}
              >
                {parcel.title}
              </td>
              <td>
                {parcel.type === "document" ? (
                  <span className="badge badge-info">Document</span>
                ) : (
                  <span className="badge badge-secondary">Non-Document</span>
                )}
              </td>
              <td>
                {new Date(parcel.creation_date).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
              <td>৳{parcel.cost}</td>
              <td>
                {parcel.payment_status === "paid" ? (
                  <span className="badge badge-success">Paid</span>
                ) : (
                  <span className="badge badge-error">Unpaid</span>
                )}
              </td>
              <td className="flex gap-2">
                <button className="btn btn-sm btn-info" title="View">
                  <FaEye />
                </button>
                <button className="btn btn-sm btn-warning" title="Edit">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(parcel._id)}
                  className="btn btn-sm btn-error"
                  title="Delete"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handlePay(parcel._id)}
                  className="btn btn-sm btn-success"
                  title="Pay Now"
                  disabled={parcel.payment_status === "paid"}
                >
                  <FaCreditCard />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
