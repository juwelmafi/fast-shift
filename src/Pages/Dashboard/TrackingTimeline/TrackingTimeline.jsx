import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import { useParams } from "react-router";
import { FaCheckCircle, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Loading from "../../shared/Loading/Loading";

const TrackingTimeline = () => {
  const axiosSecure = useAxiosSecurity();
  const { tracking_id } = useParams(); // Or pass as prop if needed

  const { data: updates = [], isLoading } = useQuery({
    queryKey: ["tracking", tracking_id],
    enabled: !!tracking_id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/trackings/${tracking_id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  if (!updates || updates.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No tracking updates found.
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-xl max-w-3xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Tracking History
      </h2>

      <div className="relative border-l-4 border-primary pl-6">
        {updates.map((item, index) => (
          <div key={index} className="mb-10 relative">
            <div className="absolute -left-3.5 top-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
              <FaCheckCircle className="text-sm" />
            </div>

            <div className="bg-base-200 p-4 rounded-lg shadow-md">
              <div className="flex justify-between mb-1">
                <span className="font-semibold capitalize text-primary">
                  {item.status.replace("_", " ")}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {item.details && (
                <p className="text-gray-700 mb-1">{item.details}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                {item.location && (
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-error" />
                    {item.location}
                  </span>
                )}
                {item.updated_by && (
                  <span className="flex items-center gap-1">
                    <FaUser />
                    {item.updated_by}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;
