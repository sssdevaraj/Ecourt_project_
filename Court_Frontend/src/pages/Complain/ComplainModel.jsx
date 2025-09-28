import { useEffect, useState } from "react";
import { TagIcon, ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosClient from "@/api/axios";
import {toast, Toaster} from "sonner";
const ComplainModal = ({ isOpen, onClose,getAllComplainst }) => {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 

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

  // Function to handle form submission for complaints
const handleSubmit = async () => {
  try {
    setIsLoading(true);

    if (!topic.trim() || !message.trim()) {
      alert("Both fields are required!");
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user")); // Fixed localStorage issue
    const userId = user?.userId; // Safer way to access userId

    if (!userId) {
      alert("User not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    // Fetch API
    const response = await axiosClient.post("/complaint", {
      user_id: userId, 
      topic,
      message,
      status: "PENDING",
    });
    getAllComplainst()
    if(response.data.status){
      toast.success(response.data.message)
    }
    
    setTopic("");
    setMessage("");
    onClose();
  } catch (error) {
    console.error("Error submitting complaint:", error);
  } finally {
    setIsLoading(false);
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
            <h2 className="text-xl font-semibold text-gray-900">Add Complaint</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic:</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
            <div className="flex items-start border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-2 mt-2" />
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                className="w-full outline-none text-sm resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}

         {
          isLoading ? (<button
            disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"

            >
  
             adding....
            </button> ) : ( <button
          disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"
            onClick={handleSubmit}
          >

            Submit Complaint
          </button>)
         
         }
         
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ComplainModal;