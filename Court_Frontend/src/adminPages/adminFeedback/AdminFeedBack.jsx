import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axiosClient from "@/api/axios";
import { formatDate } from "../../../utils/dateFormatter"

const AdminFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.userId;

        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axiosClient.get(`/admin/feedbacks`);
        if (response.data.status) {
          setFeedbackData(response.data.feedback);
        } else {
          console.error("Error fetching feedback:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Admin Feedback Management</h2>
      
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">No</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Topic</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">First Name </TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Last Name</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Email</TableHead>

              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Feedback</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbackData.length > 0 ? (
              feedbackData.map((feedback, index) => (
                <TableRow key={feedback.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <TableCell className="px-6 py-4 text-left text-gray-600">{index + 1}</TableCell>
                  <TableCell className="px-6 py-4 text-left text-gray-600">{feedback.topic}</TableCell>
                  <TableCell className="px-6 py-4 text-left text-gray-600">{feedback.first_name}</TableCell>
                  <TableCell className="px-6 py-4 text-left text-gray-600">{feedback.last_name}</TableCell>
                  <TableCell className="px-6 py-4 text-left text-gray-600">{feedback.email}</TableCell>
                  <TableCell className="px-6 py-4 text-left text-gray-600">{feedback.message}</TableCell>
                  <TableCell className="px-6 py-4 text-left text-gray-600">{formatDate(feedback.created_at)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                  No feedback found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};

export default AdminFeedback;
