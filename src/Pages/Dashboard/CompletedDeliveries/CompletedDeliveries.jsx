import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loading from "../../shared/Loading/Loading";
const CompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecurity();
  const queryClient = useQueryClient();
  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider-completed?email=${user?.email}`
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel) => {
    const isSameDistrict = parcel.sender_region === parcel.receiver_region;
    const percentage = isSameDistrict ? 0.8 : 0.3;
    return parcel.cost * percentage;
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString();
  };

  const totalEarnings = deliveries.reduce((sum, parcel) => {
    return sum + calculateEarning(parcel);
  }, 0);

  const cashoutDelivery = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/parcels/${id}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Cashout completed for this delivery.", "success");
      queryClient.invalidateQueries(["completedDeliveries", user?.email]);
    },
  });

  const handleCashOut = (id) => {
    Swal.fire({
      title: "Confirm Cashout",
      text: "Are you sure you want to cash out this delivery?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, cash out",
    }).then((result) => {
      if (result.isConfirmed) {
        cashoutDelivery.mutate(id);
      }
    });
  };

  if (isLoading) {
    return <Loading></Loading>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Completed Deliveries</h2>
      <p className="mb-4">
        Total Earnings:{" "}
        <span className="font-bold text-green-600">
          {totalEarnings.toFixed(2)} BDT
        </span>
      </p>

      {deliveries.length === 0 ? (
        <p>No completed deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th>Tracking ID</th>
                <th>Title</th>
                <th>From</th>
                <th>To</th>
                <th>Picked At</th>
                <th>Delivered At</th>
                <th>Cost</th>
                <th>Earning</th>
                <th>Cashout</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.sender_region}</td>
                  <td>{parcel.receiver_region}</td>
                  <td>{formatDate(parcel.assigned_at)}</td>
                  <td>{formatDate(parcel.updatedAt)}</td>
                  <td>{parcel.cost} BDT</td>
                  <td className="text-green-600 font-semibold">
                    {calculateEarning(parcel).toFixed(2)} BDT
                  </td>
                  <td>
                    {parcel.cashout_status === "cashed_out" ? (
                      <span className="badge badge-success text-xs px-2 py-1 whitespace-nowrap text-black">Cashed Out</span>
                    ) : (
                      <button
                        onClick={() => handleCashOut(parcel._id)}
                        className="btn btn-xs text-black btn-primary"
                        disabled={cashoutDelivery.isPending}
                      >
                        Cash Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;
