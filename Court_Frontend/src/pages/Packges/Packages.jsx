import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";

import PricingCard from "./PricingCard";

const Packages = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const freeTrial = user?.free_trial;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosClient.get("/plans/list-plan");
        console.log("response", response);
        if (response.data.status) {
          const fetchedPlans = response.data.plans.map((plan, index) => ({
            id: plan.id,
            title: plan.name,
            price: parseFloat(plan.amount),
            features: [
              `${plan.phone_number_limit} Phone Numbers`,
              `${plan.duration_days} Days Access`,
              plan.description,
            ],
            isHighlighted: index === 2,
          }));
          setPlans(fetchedPlans);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="p-12 bg-gray-100 h-screen w-full flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Choose the Best Plan for You</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        Select a pricing plan that fits your needs. Enjoy features tailored to your requirements with flexible options.
      </p>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        {plans
          .filter((_, index) => !(freeTrial === 1 && index === 0)) // Hide first plan if freeTrial is 1
          .map((plan, index) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
      </div>
    </div>
  );
};

export default Packages;
