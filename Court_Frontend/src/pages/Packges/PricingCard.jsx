import { useCallback } from "react";
import RazorPayButton from "./razorPayButton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";

const PricingCard = ({ title, price, features, isHighlighted, id }) => {
  let freeTrial;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  if (user) {
    freeTrial = user.free_trial;
  } 
  const handlePaymentSuccess = useCallback(
    async (transactionData) => {
      const payload = {
        user_id: user.userId,
        package_id: id,
        amount: price == 0 ? 1 : price,
        payment_gateway_id: String(transactionData.transactionNo),
        status: String(transactionData.statusId)
      };

      console.log("payload", payload); 

      try {
        const response = await axiosClient.post("/transactions", payload);
        if (response.data.status) {
          toast.success(response.data.message);
          navigate("/user/mobile-maintenance");
        } else {
          toast.error(response.data.message || "Transaction failed.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      }
    },
    [user, id, price, navigate]
  );

  const handlePaymentFailure = useCallback((error) => {
    console.error("Payment Failed:", error);
    toast.error("Payment Failed. Please try again.");
  }, []);

  const paymentData = {
    amount: price,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  };

  return (
    <div
      className={`relative p-8 text-center border border-gray-200 rounded-2xl shadow-lg transition-all duration-300 w-72 h-auto min-h-[450px] 
      ${
        isHighlighted
          ? "scale-110 bg-blue-600 text-white shadow-xl"
          : "bg-white text-gray-900"
      }`}
    >
      {isHighlighted && (
        <span className="absolute top-2 right-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full uppercase font-semibold">
          Popular
        </span>
      )}
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-4xl font-bold mb-6">₹{price}/mo</p>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center justify-center space-x-2"
          >
            ✅ <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Razorpay Button */}
      <RazorPayButton
        data={paymentData}
        successCallback={handlePaymentSuccess}
        failureCallback={handlePaymentFailure}
        className={`py-3 px-6 rounded-lg w-full transition font-semibold 
        ${
          isHighlighted
            ? "bg-white text-blue-600 hover:bg-gray-200"
            : "bg-black text-white hover:bg-blue-600"
        }`}
      >
        Choose Plan
      </RazorPayButton>
    </div>
  );
};

export default PricingCard;
