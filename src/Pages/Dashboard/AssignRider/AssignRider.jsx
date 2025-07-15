import { useQuery } from "@tanstack/react-query";
import { FaUserPlus } from "react-icons/fa";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import Loading from "../../shared/Loading/Loading";
import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useTrackingLogger from "../../../hooks/useTrackingLogger";

const AssignRider = () => {
  const axiosSecure = useAxiosSecurity();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/assignable");
      return res.data;
    },
  });

  const { mutateAsync: assignRider } = useMutation({
    mutationFn: async ({ parcelId, rider }) => {
      setSelectedRider(rider)
      const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
        riderId: rider._id,
        riderEmail: rider.email,
        riderName: rider.name,
      });
      return res.data;
    },
    onSuccess: async () => {
      Swal.fire("Assigned!", "Rider assigned successfully", "success");
      queryClient.invalidateQueries(["assignableParcels"]);

      // track rider assigned
      await logTracking({
        tracking_id: selectedParcel.tracking_id,
        status: "rider_assigned",
        details: `Assigned to ${selectedRider.name}`,
        updated_by: user.email,
      });
      document.getElementById("assignModal").close();
    },
    onError: () => {
      Swal.fire("Error", "Failed to assign rider", "error");
    },
  });

  const openAssignModal = async (parcel) => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);
    setRiders([]);

    try {
      const res = await axiosSecure.get("/riders/available", {
        params: {
          district: parcel.sender_service_center,
        },
      });
      setRiders(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load riders", error);
    } finally {
      setLoadingRiders(false);
      document.getElementById("assignModal").showModal();
    }
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.sender_name}</td>
                <td>{parcel.receiver_name}</td>
                <td>{parcel.payment_status}</td>
                <td>{parcel.delivery_status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary text-black"
                    onClick={() => openAssignModal(parcel)}
                  >
                    <FaUserPlus className="mr-1" /> Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rider Assign Modal */}
      <dialog id="assignModal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="text-lg font-bold mb-3">
            Assign Rider for:{" "}
            <span className="text-primary">{selectedParcel?.tracking_id}</span>
          </h3>

          {loadingRiders ? (
            <p>Loading riders...</p>
          ) : riders.length === 0 ? (
            <p className="text-error">No available riders in this area.</p>
          ) : (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Warhouse</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider) => (
                    <tr key={rider._id}>
                      <td>{rider.name}</td>
                      <td>{rider.warehouse}</td>
                      <td>{rider.email}</td>
                      <td>
                        <button
                          onClick={() =>
                            assignRider({ parcelId: selectedParcel._id, rider })
                          }
                          className="btn btn-xs btn-primary text-black"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignRider;
