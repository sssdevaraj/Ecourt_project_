import { useEffect, useState } from "react";
import { TagIcon, ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosClient from "@/api/axios";
import { toast, Toaster } from "sonner";

const FeedbackModal = ({ isOpen, onClose,fetchFeedback }) => {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); 
    setUserId(user?.userId || null);
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
   

    if (!topic.trim() || !message.trim()) {
      toast.error("Both fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosClient.post("/feedback", {
        user_id: userId,
        topic,
        message,
      });

      if (response.data.status) {
        
        toast.success("THANK YOU FOR YOUR FEEDBACK 🙏🏻🙏🏻");
        fetchFeedback()
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle 'Escape' key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <Toaster richColors />
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Submit Feedback</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
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
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FeedbackModal;
