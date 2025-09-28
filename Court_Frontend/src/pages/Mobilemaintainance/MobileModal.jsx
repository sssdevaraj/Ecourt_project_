import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosClient from "@/api/axios";
import { toast, Toaster } from "sonner";

const MobileNoModal = ({ isOpen, onClose, subscription, getSubscriptions }) => {
  const [mobileNo, setMobileNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [party_name, setPartyName] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Validation function for Indian mobile numbers.
  const isValidIndianMobileNumber = (number) => {
    const regex = /^(?:\+91|0)?[6-9]\d{9}$/;
    return regex.test(number);
  };

  const handleSubmit = async () => {
    if (!mobileNo.trim()) {
      toast.error("Mobile number is required!");
      return;
    }

    if (!isValidIndianMobileNumber(mobileNo.trim())) {
      toast.error("Please enter a valid Indian mobile number!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/mobile-maintainance/save-number/", {
        subscription_id: subscription.id,
        mobile_number: mobileNo.trim(),
        party_name: party_name
      });
      
      toast.success(response.data.message);
     
      getSubscriptions();
      setMobileNo("");
    } catch (error) {
      console.error("Error saving mobile number:", error);
      toast.error("An error occurred while saving the mobile number.");
    } finally {
      setLoading(false);
      onClose()
      
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <Toaster richColors />
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add Mobile Number</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number:
            </label>
            <input
              type="text"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

           {/* part_name */}
           <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Party Name:
            </label>
            <input
              type="text"
              value={party_name}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>


          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MobileNoModal;
