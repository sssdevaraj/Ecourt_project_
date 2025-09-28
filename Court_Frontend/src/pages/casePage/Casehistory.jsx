import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Filter, ChevronLeft, X } from "lucide-react";
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

const CaseHistoryTable = () => {
  const [cases, setCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cnr_number: "",
    case_number: "",
    party_name: "",
    from_date: "",
    to_date: "",
  });
  const [selectedCase, setSelectedCase] = useState(null);

  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  // Redirect to login if user is not authenticated
  if (!storedUser) {
    navigate("/login");
    return null;
  }

  const user = JSON.parse(storedUser);

  const fetchCaseHistory = useCallback(async (page = 1, limit = 10, appliedFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...appliedFilters,
      }).toString();

      const response = await axiosClient.get(
        `/cases/case-history/${user.userId}?${queryParams}`
      );
      console.log("fetchCaseHistory", response);

      if (response.data.status) {
        setCases(response.data.history || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error(response.data.message || "Failed to fetch case history");
      }
    } catch (error) {
      console.error("Error fetching case history:", error);
      setError(error.message);
      toast.error(error.message || "Failed to fetch case history. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    let mounted = true;
    fetchCaseHistory(currentPage, 10, filters);

    return () => {
      mounted = false;
    };
  }, [currentPage, filters, fetchCaseHistory]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    if (filters.from_date && filters.to_date && new Date(filters.to_date) < new Date(filters.from_date)) {
      toast.error("To Date cannot be earlier than From Date");
      return;
    }
    setCurrentPage(1);
    fetchCaseHistory(1, 10, filters);
  };

  const clearFilters = () => {
    setFilters({
      cnr_number: "",
      case_number: "",
      party_name: "",
      from_date: "",
      to_date: "",
    });
    setCurrentPage(1);
    fetchCaseHistory(1, 10, {});
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  const parseJSONField = (field) => {
    if (!field) return "N/A";
    try {
      const parsed = JSON.parse(field);
      
      // Handle acts object specifically
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.acts && parsed.sections) {
          return `${parsed.acts}, Section ${parsed.sections}`;
        }
        // Handle array case
        if (Array.isArray(parsed)) {
          return parsed.join(", ") || "N/A";
        }
        // Handle other objects by stringifying their values
        return Object.values(parsed).filter(val => val).join(", ") || "N/A";
      }
      
      return parsed || "N/A";
    } catch {
      return field || "N/A";
    }
  };

  const formatActsAndSections = (actsField) => {
    if (!actsField) return "N/A";
    
    try {
      const parsed = JSON.parse(actsField);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.acts && parsed.sections) {
          return (
            <div>
              <div><strong>Acts:</strong> {parsed.acts}</div>
              <div><strong>Sections:</strong> {parsed.sections}</div>
            </div>
          );
        }
        return JSON.stringify(parsed);
      }
      return parsed;
    } catch {
      return actsField;
    }
  };

  const handleRowClick = (caseItem) => {
    setSelectedCase(caseItem);
  };

  if (selectedCase) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setSelectedCase(null)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to Case History
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Case Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailItem label="CNR Number" value={selectedCase.cnr_number} />
                <DetailItem label="Case Number" value={selectedCase.case_number} />
                <DetailItem label="Next Date" value={formatDate(selectedCase.next_date)} />
                <DetailItem label="Case Type" value={selectedCase.case_type || "N/A"} />
                <DetailItem label="State" value={selectedCase.state} />
                <DetailItem label="District" value={selectedCase.district || "N/A"} />
                <DetailItem label="Court Complex" value={selectedCase.court_complex || "N/A"} />
                <DetailItem label="Court Number and Judge" value={selectedCase.court_number_and_judge || "N/A"} />
                <DetailItem label="Case Stage" value={selectedCase.case_stage || "N/A"} />
                <DetailItem label="Filing Number" value={selectedCase.filing_number || "N/A"} />
                <DetailItem label="Registration Date" value={formatDate(selectedCase.registration_date)} />
              </div>

              <div className="space-y-4">
                <DetailItem label="Petitioners" value={parseJSONField(selectedCase.petitioners)} />
                <DetailItem label="Petitioner Advocates" value={parseJSONField(selectedCase.petitioner_advocates)} />
                <DetailItem label="Respondents" value={parseJSONField(selectedCase.respondents)} />
                <DetailItem label="Respondent Advocates" value={parseJSONField(selectedCase.respondent_advocates)} />
                <DetailItem label="Filing Date" value={formatDate(selectedCase.filing_date)} />
                <DetailItem label="First Hearing Date" value={formatDate(selectedCase.first_hearing_date)} />
                <DetailItem label="Decision Date" value={formatDate(selectedCase.decision_date)} />
                <DetailItem label="Nature of Disposal" value={selectedCase.nature_of_disposal || "N/A"} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Acts and Sections</h3>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {formatActsAndSections(selectedCase.acts)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Case History</h1>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          {showFilters ? "Hide Filters" : "Filter"}
        </Button>
      </div>
      <Toaster />

      {/* Filter Box above the table */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNR Number</label>
              <input
                type="text"
                name="cnr_number"
                value={filters.cnr_number}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                placeholder="Enter CNR Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
              <input
                type="text"
                name="case_number"
                value={filters.case_number}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                placeholder="Enter Case Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party Name</label>
              <input
                type="text"
                name="party_name"
                value={filters.party_name}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                placeholder="Enter Party Name"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              className="bg-gray-500 hover:bg-gray-600 text-white"
              onClick={clearFilters}
            >
              Clear
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>CNR Number</TableHead>
                <TableHead>Case Number/Year</TableHead>
                <TableHead>Case Type</TableHead>
                <TableHead>Court Number and Judge</TableHead>
                <TableHead>Filing Date</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Court Complex</TableHead>
                <TableHead>Stage of Case</TableHead>
                <TableHead>Case Status</TableHead>
                <TableHead>State</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Next Hearing Date</TableHead>
                <TableHead>Petitioner and Advocate</TableHead>
                <TableHead>Respondent and Advocate</TableHead>
                <TableHead>First Hearing Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={17} className="text-center py-4">
                    Loading case history...
                  </TableCell>
                </TableRow>
              ) : cases.length > 0 ? (
                cases.map((caseItem, index) => (
                  <TableRow
                    key={caseItem.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(caseItem)}
                  >
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{caseItem.cnr_number || "N/A"}</TableCell>
                    <TableCell>{caseItem.case_number || "N/A"}</TableCell>
                    <TableCell>{caseItem.case_type || "N/A"}</TableCell>
                    <TableCell>{caseItem.court_number_and_judge || "N/A"}</TableCell>
                    <TableCell>{formatDate(caseItem.filing_date)}</TableCell>
                    <TableCell>{formatDate(caseItem.registration_date)}</TableCell>
                    <TableCell>{caseItem.court_complex || "N/A"}</TableCell>
                    <TableCell>{caseItem.case_stage || "N/A"}</TableCell>
                    <TableCell>
                      {caseItem.is_approved ? "Approved" : "Pending"}
                    </TableCell>
                    <TableCell>{caseItem.state || "N/A"}</TableCell>
                    <TableCell>{caseItem.district || "N/A"}</TableCell>
                    <TableCell>{formatDate(caseItem.next_date)}</TableCell>
                    <TableCell>
                      <div>{parseJSONField(caseItem.petitioners)}</div>
                      {caseItem.petitioner_advocates && (
                        <div className="text-xs text-gray-500">
                          Advocate: {parseJSONField(caseItem.petitioner_advocates)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{parseJSONField(caseItem.respondents)}</div>
                      {caseItem.respondent_advocates && (
                        <div className="text-xs text-gray-500">
                          Advocate: {parseJSONField(caseItem.respondent_advocates)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(caseItem.first_hearing_date)}</TableCell>
                    <TableCell>
                      <Eye
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(caseItem);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={17} className="text-center py-4">
                    No case history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
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
    <p className="mt-1 text-lg font-semibold text-gray-900">{value || "N/A"}</p>
  </div>
);

export default CaseHistoryTable;