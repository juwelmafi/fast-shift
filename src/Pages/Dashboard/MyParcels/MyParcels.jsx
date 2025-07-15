import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import { FaEye, FaEdit, FaTrash, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Loading from "../../shared/Loading/Loading";

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

  if (!parcels) {
    return <Loading></Loading>;
  }

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
    navigate(`/dashboard/payment/${id}`);
  };

  const handleViewTracking = (trackingId) => {
    navigate(`/dashboard/tracking/${trackingId}`);
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
            <th>Delivery</th>
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
              <td>{parcel.delivery_status || 'N/A'}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => handleViewTracking(parcel.tracking_id)}
                  className="btn btn-sm btn-accent"
                  title="View Tracking"
                >
                  <FaMapMarkerAlt className="mr-1" /> 
                </button>
                {/* <button className="btn btn-sm btn-warning" title="Edit">
                  <FaEdit /> 
                </button> */}
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
