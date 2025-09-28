

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, ChevronLeft, Eye } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import axiosClient from "@/api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const CasesStatusScreen = () => {
  const [cases, setCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [handleWhatsappLoading, setHandleWhatsappLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for CNR number search
  const [selectedCase, setSelectedCase] = useState(null);

  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    console.error("User not found in localStorage");
    navigate("/login");
    return null;
  }
  const user = JSON.parse(storedUser);

  const fetchApprovedCases = async (page = 1, limit = 10, cnrNumber = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        is_approved: true, // Only fetch approved cases
        ...(cnrNumber && { cnr_number: cnrNumber }), // Add cnr_number to query if present
      }).toString();

      const response = await axiosClient.get(`/cases/${user.userId}?${queryParams}`);

      if (response.data?.data) {
        // Filter to only include approved cases (double check)
        const approvedCases = response.data.data.filter((caseItem) => caseItem.is_approved);
        setCases(approvedCases);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setCases([]);
      }
    } catch (error) {
      console.error("Error fetching approved cases:", error);
      toast.error("Failed to fetch approved cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedCases(currentPage, 10, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCheckboxChange = (caseId) => {
    setSelectedCaseIds((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
    );
  };

  const handleSendWhatsApp = (caseItem) => {
    const message = `Case Details:
CNR Number: ${caseItem.cnr_number}
Case Number: ${caseItem.case_number}
Party Name: ${caseItem.party_name}
Next Date: ${new Date(caseItem.next_date).toLocaleDateString()}
Status: Approved`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleBulkWhatsApp = async (e) => {
    e.preventDefault();
    if (selectedCaseIds.length === 0) {
      toast.error("Please select at least one case");
      return;
    }

    setHandleWhatsappLoading(true);
    try {
      const response = await axiosClient.post("/whatsapp/handle-manual-message", {
        user_id: user.userId,
        case_id: selectedCaseIds,
      });

      response.data.status
        ? toast.success(response.data.message)
        : toast.error(response.data.message);
    } catch (error) {
      console.error("Bulk WhatsApp error:", error);
      toast.error("Failed to send WhatsApp messages");
    } finally {
      setHandleWhatsappLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchApprovedCases(1, 10, "");
  };

  if (selectedCase) {
    // Parse JSON fields for detail view
    const petitioners = JSON.parse(selectedCase.petitioners || "[]").join(", ") || "N/A";
    const respondents = JSON.parse(selectedCase.respondents || "[]").join(", ") || "N/A";
    const respondentAdvocates = JSON.parse(selectedCase.respondent_advocates || "[]").join(", ") || "N/A";
    const latestHistory = selectedCase.history
      ? selectedCase.history[selectedCase.history.length - 1]
      : {};

    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setSelectedCase(null)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to Approved Cases
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Case Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailItem label="CNR Number" value={selectedCase.cnr_number} />
                <DetailItem label="Case Number" value={selectedCase.case_number} />
                <DetailItem label="Case Type" value={selectedCase.case_type} />
                <DetailItem label="Court Number and Judge" value={selectedCase.court_establishment} />
                <DetailItem label="Party Name" value={selectedCase.party_name} />
                <DetailItem label="Petitioners" value={petitioners} />
              </div>

              <div className="space-y-4">
                <DetailItem label="Respondents" value={respondents} />
                <DetailItem label="Respondent Advocates" value={respondentAdvocates} />
                <DetailItem label="Purpose of Hearing" value={latestHistory.purpose || "N/A"} />
                <DetailItem label="Stage of Case" value={selectedCase.stage_of_case || "N/A"} />
                <DetailItem
                  label="Next Date"
                  value={new Date(selectedCase.next_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                />
                <DetailItem
                  label="Status"
                  value={<span className="font-bold text-green-600">Approved</span>}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => handleSendWhatsApp(selectedCase)}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              >
                <Send size={16} />
                Send WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatToNextDayIST = (dateString) => {
    if (!dateString) return null; // Return null instead of empty string for database consistency
  
    try {
      const utcDate = new Date(dateString);
      if (isNaN(utcDate.getTime())) return null;
  
      // Add 1 day (handles month/year transitions automatically)
      const nextDayUtc = new Date(utcDate);
      nextDayUtc.setUTCDate(utcDate.getUTCDate() + 1);
  
      // Format in IST without time (just date)
      return nextDayUtc.toLocaleString("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Approved Cases</h1>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by CNR Number"
              className="pl-4 pr-10 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={handleBulkWhatsApp}
          >
            <MessageCircle className="w-5 h-5" />
            {handleWhatsappLoading ? "Sending..." : "Bulk WhatsApp"}
          </Button>
        </div>
      </div>
      <Toaster />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  checked={selectedCaseIds.length > 0 && selectedCaseIds.length === cases.length}
                  onChange={(e) => {
                    setSelectedCaseIds(
                      e.target.checked ? cases.map((caseItem) => caseItem.id) : []
                    );
                  }}
                />
              </TableHead>
              <TableHead>S.No</TableHead>
              <TableHead>CNR Number</TableHead>
              <TableHead>Case Number</TableHead>
              <TableHead>Case Type</TableHead>
              <TableHead>Court Number and Judge</TableHead>
              <TableHead>Next Hearing Date</TableHead>
              <TableHead>Stage of Case</TableHead>
              <TableHead>Case Status</TableHead>
              <TableHead>Petitioners</TableHead>
              <TableHead>Respondents</TableHead>
              <TableHead>Respondent Advocates</TableHead>
              <TableHead>Purpose of Hearing</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : cases.length > 0 ? (
              cases.map((caseItem, index) => {
                // Parse JSON fields
                const petitioners = JSON.parse(caseItem.petitioners || "[]").join(", ") || "N/A";
                const respondents = JSON.parse(caseItem.respondents || "[]").join(", ") || "N/A";
                const respondentAdvocates = JSON.parse(caseItem.respondent_advocates || "[]").join(", ") || "N/A";
               
                // Get latest history for purpose
                const latestHistory = caseItem.history
                  ? caseItem.history[caseItem.history.length - 1]
                  : {};

                return (
                  <TableRow key={caseItem.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCaseIds.includes(caseItem.id)}
                        onChange={() => handleCheckboxChange(caseItem.id)}
                      />
                    </TableCell>
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{caseItem.cnr_number}</TableCell>
                    <TableCell>{caseItem.case_number}</TableCell>
                   
                   
                    <TableCell>{caseItem.case_type}</TableCell>
                    <TableCell> {caseItem.court_and_judge} </TableCell>
                    {/* <TableCell>{caseItem.court_establishment}</TableCell> */}
                    
                    <TableCell>
                      {formatToNextDayIST(caseItem.next_date)}
                      {/* <TableCell> {caseItem.case_stage} </TableCell> */}
                    </TableCell>
                    <TableCell>{caseItem.case_stage || "N/A"}</TableCell>
                    <TableCell className="font-bold text-green-600">Approved</TableCell>
                    <TableCell>{petitioners}</TableCell>
                    <TableCell>{respondents}</TableCell>
                    <TableCell>{respondentAdvocates}</TableCell>
                    <TableCell>{latestHistory.purpose || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Eye
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                          onClick={() => setSelectedCase(caseItem)}
                        />
                        {/* <Send
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendWhatsApp(caseItem);
                          }}
                          className="cursor-pointer text-green-500 hover:text-green-700"
                        /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-4">
                  No approved cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Helper component for detail view
const DetailItem = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="mt-1 text-lg font-semibold text-gray-900">{value || "-"}</p>
  </div>
);

export default CasesStatusScreen;