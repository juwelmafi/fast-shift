import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import Loading from "../../shared/Loading/Loading";
import useTrackingLogger from "../../../hooks/useTrackingLogger";

const PendingTask = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecurity();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["pendingParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider-tasks?email=${user?.email}`
      );
      return res.data;
    },
  });

  const markAsPickedUp = useMutation({
    mutationFn: async (parcel) => {
      const res = await axiosSecure.patch(`/parcels/${parcel._id}/picked-up`);
      if (res.data.modifiedCount > 0) {
        await logTracking({
          tracking_id: parcel.tracking_id,
          status: "in_transit",
          details: `Picked up by ${user.displayName}`,
          updated_by: user.email,
        });
      }
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Picked Up!", "Parcel is now in transit.", "success");
      queryClient.invalidateQueries(["pendingParcels", user?.email]);
    },
  });

  const markAsDelivered = useMutation({
    mutationFn: async (parcel) => {
      const res = await axiosSecure.patch(`/parcels/${parcel._id}/delivered`);
      if (res.data.modifiedCount > 0) {
        await logTracking({
          tracking_id: parcel.tracking_id,
          status: "in_transit",
          details: `Delivered by ${user.displayName}`,
          updated_by: user.email,
        });
      }
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Delivered!", "Parcel delivery completed.", "success");
      queryClient.invalidateQueries(["pendingParcels", user?.email]);
    },
  });

  const handleMarkAsPickedUp = (parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this parcel as picked up?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, pick it up!",
    }).then((result) => {
      if (result.isConfirmed) {
        markAsPickedUp.mutate(parcel);
      }
    });
  };

  const handleMarkAsDelivered = (parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this parcel as delivered?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deliver it!",
    }).then((result) => {
      if (result.isConfirmed) {
        markAsDelivered.mutate(parcel);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
      {parcels.length === 0 ? (
        <p>No pending tasks.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Weight</th>
                <th>Receiver</th>
                <th>To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.weight} kg</td>
                  <td>{parcel.receiver_name}</td>
                  <td>{parcel.receiver_region}</td>
                  <td>
                    <span className="capitalize">
                      {parcel.delivery_status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        onClick={() => handleMarkAsPickedUp(parcel)}
                        className="btn btn-sm btn-warning"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {parcel.delivery_status === "in_transit" && (
                      <button
                        onClick={() => handleMarkAsDelivered(parcel)}
                        className="btn btn-sm btn-success"
                      >
                        Mark Delivered
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

export default PendingTask;
