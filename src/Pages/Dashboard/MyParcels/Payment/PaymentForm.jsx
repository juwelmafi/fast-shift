import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from "../../../../hooks/useAxiosSecurity";
import Loading from "../../../shared/Loading/Loading";
import useAuth from "../../../../hooks/useAuth";
import Swal from "sweetalert2";
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecurity();
  const navigate = useNavigate();
  console.log(parcelId);

  const { isPending, data } = useQuery({
    queryKey: ["all-parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`all-parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loading></Loading>;
  }

  const parcelInfo = data?.data;
  console.log(parcelInfo);

  const amount = parcelInfo?.cost;

  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true); // Start loading

    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setSuccess("");
      setLoading(false);
      return;
    }else{
      setError("")
      console.log('payment method', paymentMethod)
    }

    try {
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

      if (result?.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result?.paymentIntent?.status === "succeeded") {
        setError("");
        const paymentData = {
          parcel_id: parcelId,
          created_by: user?.email,
          amount,
          transaction_id: result?.paymentIntent?.id,
          payment_method: result?.paymentIntent?.payment_method_types,
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);

        if (paymentRes?.data?.payment_id) {
          setLoading(false);
          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `<strong>Transaction ID:</strong> <code>${result?.paymentIntent?.id}</code>`,
            confirmButtonText: "Go to My Parcels",
          });

          navigate("/dashboard/my-parcels");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      // Stop loading in all cases
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className=" mt-10 w-2xl mx-auto p-5 rounded-2xl shadow-md"
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        {loading ? (
          <button className="btn btn-primary mt-4" disabled>
            <span className="loading loading-spinner"></span>
            Processing...
          </button>
        ) : (
          <button
            type="submit"
            disabled={!stripe}
            className="btn btn-primary mt-4 text-black"
          >
            Pay ${amount} For Parcel Pickup
          </button>
        )}

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
