import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Loading/Loading";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecurity();

  const { isPending, data } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data;
    },
  });
  const payments = data?.data;
  if (isPending) {
    return <Loading></Loading>;
  }

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Payment History</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Parcel</th>
            <th>Transaction ID</th>
            <th>Amount (৳)</th>
            <th>Method</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td className="capitalize">{item.parcel_id || "N/A"}</td>
              <td className="text-sm">{item.transaction_id}</td>
              <td>৳{item.amount}</td>
              <td>
                {item.payment_method?.map((method, index) => (
                  <p key={index}>{method}</p>
                )) || <span className="text-gray-400">N/A</span>}
              </td>
              <td>
                {new Date(item.paid_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
