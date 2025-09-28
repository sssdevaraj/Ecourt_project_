import { useCallback } from "react";
import TransactionStatus from "@/enums/transactionStatus";

export default function RazorPayButton({
  data = null,
  successCallback,
  failureCallback,
  className,
  children,
}) {

   
  const handlePayment = useCallback(() => {
    if (!window.Razorpay) {
      console.error("Razorpay SDK not loaded.");
      return;
    }

    const options = {
      key: "rzp_test_N2y7XnoOJWX4Ep", //  test/live key
      name: "Court_App",
      amount: (data?.amount || 1) * 100, 
      currency: "INR",
      description: "Package Subscription",
      handler: (res) => {
        successCallback({
          transactionNo: res.razorpay_payment_id,
          statusId: TransactionStatus.Success,
          response: JSON.stringify(res),
        });
      },
      prefill: {
        name: data?.name || "Guest",
        email: data?.email || "guest@example.com",
        contact: data?.mobile || "0000000000",
      },
      theme: { color: "#fc8019" },
    };

    const rzpay = new window.Razorpay(options);

    rzpay.on("payment.failed", (response) => {
      failureCallback({
        transactionNo: "",
        statusId: TransactionStatus.Failed,
        response: JSON.stringify(response),
      });
      rzpay.close();
    });

    rzpay.open();
  }, [data, successCallback, failureCallback]);

  return (
    <button onClick={handlePayment} type="button" className={className}>
      {children || "Make Payment"}
    </button>
  );
}
