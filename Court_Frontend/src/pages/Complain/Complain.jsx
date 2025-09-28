import { useEffect, useState } from "react";
import ComplainModal from "./ComplainModel";
import FeedbackModal from "../Feedback/FeedbackModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axiosClient from "@/api/axios";

const Complain = () => {
  const [isComplainModalOpen, setIsComplainModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [loading ,setLoading] = useState(false)

  const [complaints, setComplaints] = useState([]);


    const getAllComplainst = async () => {
      setLoading(true)
      try {
        const user = JSON.parse(localStorage.getItem("user")); 
         const userId = user?.userId;

        const response = await axiosClient.get(`/complaint/${userId}`);
        
        setComplaints(response.data.complain);

      } catch (error) {
        console.error(error);
        
      } finally {
        setLoading(false)
      }
      
    }

    useEffect(() => {
      getAllComplainst();
    }, []);

  return (
    <div className="w-full h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Complaint Management</h2>
        </div>
        <div className="flex gap-4">
          {/* Feedback Button */}
        

          {/* Add Complain Button */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200"
            onClick={() => setIsComplainModalOpen(true)}
          >
            + Add Complaint
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-6 py-4 text-center">
                <input type="checkbox" className="w-4 h-4" />
              </TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">No</TableHead>
              {/* <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Complaint Number</TableHead> */}
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Complaint Topic</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Message</TableHead>
              {/* <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Complaint Date</TableHead> */}
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {
              loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                      <span className="ml-2 text-gray-900">Loading...</span>
                    </div>  
                  </td>
                </tr>
              ) : (
                complaints.map((complain, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell className="px-6 py-4 text-center">
                      <input type="checkbox" className="w-4 h-4" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left text-gray-600">{index + 1}</TableCell>
                    
                    <TableCell className="px-6 py-4 text-left text-gray-600">{complain.topic}</TableCell>
                    <TableCell className="px-6 py-4 text-left text-gray-600">{complain.message}</TableCell>
                    {/* <TableCell className="px-6 py-4 text-left text-gray-600">{complain.complainDate}</TableCell> */}
                    <TableCell className="px-6 py-4 text-left text-gray-600">{complain.status}</TableCell>
                  </TableRow>
                ))
              )
            }
           
          </TableBody>
        </Table>
      </div>

      {/* Footer Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-600">Showing 0 to 0 of 0 entries</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            &lt;&lt;
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            &lt;
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            &gt;
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            &gt;&gt;
          </Button>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>

      {/* Modal Components */}
      <ComplainModal
      getAllComplainst ={getAllComplainst}
        isOpen={isComplainModalOpen}
        onClose={() => setIsComplainModalOpen(false)}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
};

export default Complain;