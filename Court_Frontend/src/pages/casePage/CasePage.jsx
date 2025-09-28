



// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Eye, Pencil, Send, Trash2, Filter } from "lucide-react";
// import { MessageCircle } from "lucide-react";
// import { Toaster, toast } from "sonner";
// import axiosClient from "@/api/axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import AddCaseModal from "./AddCaseModal";
// import DeleteCaseModel from "./DeleteModel";
// import UpdateCaseModal from "./UpdateCaseModal";

// const CaseTable = () => {
//   const [open, setOpen] = useState(false);
//   const [cases, setCases] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
//   const [id, setId] = useState("");
//   const [selectedCase, setSelectedCase] = useState(null);
//   const [selectedCaseIds, setSelectedCaseIds] = useState([]);
//   const [handleWhatsappLoading, setHandleWhatsappLoading] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     cnr_number: "",
//     case_status: "",
//     next_date: "",
//     case_number: "",
//   });

//   const storedUser = localStorage.getItem("user");
//   if (!storedUser) {
//     console.error("User not found in localStorage");
//     return null;
//   }
//   const user = JSON.parse(storedUser);

//   const fetchCases = async (page = 1, limit = 10, appliedFilters = {}) => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page,
//         limit,
//         ...appliedFilters,
//       }).toString();
//       const response = await axiosClient.get(`/cases/${user.userId}?${queryParams}`);
//       console.log(response.data);
//       if (response.data && response.data.data) {
//         setCases(response.data.data);
//         setTotalPages(response.data.totalPages || 1);
//       } else {
//         setCases([]);
//       }
//     } catch (error) {
//       console.error("Error fetching cases:", error);
//       toast.error("Failed to fetch cases.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCases(currentPage, 10, filters);
//   }, [currentPage, filters]);

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const handleCheckboxChange = (caseId) => {
//     setSelectedCaseIds((prevSelectedIds) =>
//       prevSelectedIds.includes(caseId)
//         ? prevSelectedIds.filter((id) => id !== caseId)
//         : [...prevSelectedIds, caseId]
//     );
//   };

//   const handleSendWhatsApp = (caseItem) => {
//     const message = `Case Details:
//     CNR Number: ${caseItem.cnr_number}
//     Case Number: ${caseItem.case_number}
//     Party Name: ${caseItem.party_name}
//     Next Date: ${new Date(caseItem.next_date).toLocaleDateString()}
//     Status: ${caseItem.is_approved ? "Approved" : "Not Approved"}`;
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
//     window.open(whatsappUrl, "_blank");
//   };

//   const handleManualMessage = async (e) => {
//     e.preventDefault();
//     if (selectedCaseIds.length === 0) {
//       toast.error("Please select at least one case to send a message.");
//       return;
//     }
//     setHandleWhatsappLoading(true);
//     try {
//       const response = await axiosClient.post("/whatsapp/handle-manual-message", {
//         user_id: user.userId,
//         case_id: selectedCaseIds,
//       });
//       if (response.data.status) {
//         toast.success(response.data.message);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error sending WhatsApp message:", error);
//       toast.error("Failed to send WhatsApp message.");
//     } finally {
//       setHandleWhatsappLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const applyFilters = () => {
//     setCurrentPage(1); // Reset to first page when applying filters
//     fetchCases(1, 10, filters);
//     setIsFilterOpen(false); // Close filter panel after applying
//   };

//   const clearFilters = () => {
//     setFilters({
//       cnr_number: "",
//       case_status: "",
//       next_date: "",
//       case_number: "",
//     });
//     setCurrentPage(1);
//     fetchCases(1, 10, {});
//     setIsFilterOpen(false);
//   };

//   return (
//     <>
//       <div className="container mx-auto p-6 relative">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Case Management</h1>
//           <div className="flex gap-3">
//             <Button onClick={() => setOpen(true)}>+ Add New Case</Button>
//             {/* <Button
//               className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
//               onClick={(e) => handleManualMessage(e)}
//             >
//               <MessageCircle className="w-5 h-5" />
//               {handleWhatsappLoading ? "Loading..." : "SEND WHATSAPP"}
//             </Button> */}
//             <Button
//               className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
//               onClick={() => setIsFilterOpen(true)}
//             >
//               <Filter className="w-5 h-5" />
//               Filter
//             </Button>
//           </div>
//         </div>
//         <Toaster />

//         {/* Filter Panel */}
//         <div
//           className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
//             isFilterOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Filter Cases</h2>
//               <Button
//                 variant="ghost"
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => setIsFilterOpen(false)}
//               >
//                 Close
//               </Button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">CNR Number</label>
//                 <input
//                   type="text"
//                   name="cnr_number"
//                   value={filters.cnr_number}
//                   onChange={handleFilterChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//                   placeholder="Enter CNR Number"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Case Number</label>
//                 <input
//                   type="text"
//                   name="case_number"
//                   value={filters.case_number}
//                   onChange={handleFilterChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//                   placeholder="Enter Case Number"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Case Status</label>
//                 <select
//                   name="case_status"
//                   value={filters.case_status}
//                   onChange={handleFilterChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//                 >
//                   <option value="">All</option>
//                   <option value="approved">Approved</option>
//                   <option value="not_approved">Not Approved</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Next Date</label>
//                 <input
//                   type="date"
//                   name="next_date"
//                   value={filters.next_date}
//                   onChange={handleFilterChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-between mt-6">
//               <Button
//                 className="bg-gray-500 hover:bg-gray-600 text-white"
//                 onClick={clearFilters}
//               >
//                 Clear
//               </Button>
//               <Button
//                 className="bg-blue-500 hover:bg-blue-600 text-white"
//                 onClick={applyFilters}
//               >
//                 Apply
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Overlay for filter panel */}
//         {isFilterOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-30 z-40"
//             onClick={() => setIsFilterOpen(false)}
//           ></div>
//         )}

//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <Table>
//             <TableHeader className="bg-gray-100">
//               <TableRow>
//                 <TableHead>
//                   <input
//                     type="checkbox"
//                     checked={
//                       selectedCaseIds.length === cases.length && cases.length > 0
//                     }
//                     onChange={(e) =>
//                       setSelectedCaseIds(
//                         e.target.checked
//                           ? cases.map((caseItem) => caseItem.id)
//                           : []
//                       )
//                     }
//                   />
//                 </TableHead>
//                 <TableHead>No</TableHead>
//                 <TableHead>CNR Number</TableHead>
//                 <TableHead>Case Number</TableHead>
//                 <TableHead>Petitioner</TableHead>
//                 <TableHead>Advocate</TableHead> 
//                 <TableHead>Respondent</TableHead>
//                 <TableHead>Next Hearing  Date</TableHead>
//                 <TableHead>Valid & Approved</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={11} className="text-center py-4">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : cases.length > 0 ? (
//                 cases.map((caseItem, index) => (
//                   <TableRow key={caseItem.id}>
//                     {
//                       caseItem.is_approved === 0  || caseItem.is_approved === 1 ?  (
//                         <>
//                         <TableCell>

// <input
//   type="checkbox"
//   checked={selectedCaseIds.includes(caseItem.id)}
//   onChange={() => handleCheckboxChange(caseItem.id)}
// />
// </TableCell>
// <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
// <TableCell>{caseItem.cnr_number}</TableCell>
// <TableCell>{caseItem.case_number}</TableCell>
// <TableCell>{caseItem.party_name}</TableCell>
// <TableCell>{caseItem.petitioner}</TableCell>
// <TableCell>{caseItem.petitioner}</TableCell>
// <TableCell>{caseItem.petitioner}</TableCell>
// <TableCell>
// {new Date(caseItem.next_date).toLocaleDateString('en-GB', {
//   day: 'numeric',
//   month: 'short',
//   year: 'numeric',
// })}
// </TableCell>
// <TableCell
// className={`font-bold ${
//   caseItem.is_approved ? "text-green-600" : "text-red-600"
// }`}
// >
// {caseItem.is_approved ? "Approved" : "Not Approved"}
// </TableCell>
// <TableCell>
// <div className="flex gap-3">
//   {!caseItem.is_approved && (
//     <Pencil
//       className="cursor-pointer text-blue-500 hover:text-blue-700"
//       onClick={() => {
//         setSelectedCase(caseItem);
//         setUpdateModalOpen(true);
//       }}
//     />
//   )}
//   <Send
//     onClick={() => handleSendWhatsApp(caseItem)}
//     className="cursor-pointer text-green-500 hover:text-green-700"
//   />
//   <Trash2
//     onClick={() => {
//       setDeleteModalOpen(true);
//       setId(caseItem.id);
//     }}
//     className="cursor-pointer text-red-500 hover:text-red-700"
//   />
// </div>
// </TableCell>
//                         </>  
//                       ) : ''
//                     }
                    
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={11} className="text-center py-4">
//                     No cases found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-center mt-6">
//           <Button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <span className="mx-4">
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>

//         {/* Add Case Modal */}
//         <AddCaseModal fetchCases={fetchCases} open={open} close={setOpen} />

//         {/* Delete Case Modal */}
//         <DeleteCaseModel
//           open={isDeleteModalOpen}
//           setOpen={setDeleteModalOpen}
//           id={id}
//           fetchCases={fetchCases}
//         />

//         {/* Update Case Modal */}
//         {isUpdateModalOpen && (
//           <UpdateCaseModal
//             open={isUpdateModalOpen}
//             close={() => {
//               setUpdateModalOpen(false);
//               setSelectedCase(null);
//             }}
//             fetchCases={fetchCases}
//             caseData={selectedCase}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default CaseTable;

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Send, Trash2 } from "lucide-react";
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
import AddCaseModal from "./AddCaseModal";
import DeleteCaseModel from "./DeleteModel";
import UpdateCaseModal from "./UpdateCaseModal";

const CaseTable = () => {
  const [open, setOpen] = useState(false);
  const [cases, setCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [handleWhatsappLoading, setHandleWhatsappLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for CNR number search

  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    console.error("User not found in localStorage");
    return null;
  }
  const user = JSON.parse(storedUser);

  const fetchCases = async (page = 1, limit = 10, cnrNumber = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(cnrNumber && { cnr_number: cnrNumber }), // Add cnr_number to query if present
      }).toString();
      const response = await axiosClient.get(`/cases/${user.userId}?${queryParams}`);
      if (response.data && response.data.data) {
        setCases(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setCases([]);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Failed to fetch cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases(currentPage, 10, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCheckboxChange = (caseId) => {
    setSelectedCaseIds((prevSelectedIds) =>
      prevSelectedIds.includes(caseId)
        ? prevSelectedIds.filter((id) => id !== caseId)
        : [...prevSelectedIds, caseId]
    );
  };

  const handleSendWhatsApp = (caseItem) => {
    const message = `Case Details:
    CNR Number: ${caseItem.cnr_number}
    Case Number: ${caseItem.case_number}
    Party Name: ${caseItem.party_name}
    Next Date: ${new Date(caseItem.next_date).toLocaleDateString()}
    Status: ${caseItem.is_approved ? "Approved" : "Not Approved"}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleManualMessage = async (e) => {
    e.preventDefault();
    if (selectedCaseIds.length === 0) {
      toast.error("Please select at least one case to send a message.");
      return;
    }
    setHandleWhatsappLoading(true);
    try {
      const response = await axiosClient.post("/whatsapp/handle-manual-message", {
        user_id: user.userId,
        case_id: selectedCaseIds,
      });
      if (response.data.status) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      toast.error("Failed to send WhatsApp message.");
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
    fetchCases(1, 10, "");
  };
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
  
  const caseData = {
    // ... other fields
    next_date: formatToNextDayIST(status.nextHearingDate) || 'N/A', // Fallback to 'N/A' if null
    // ... other fields
  };
  
  
  
  

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Case Management</h1>
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
            <Button onClick={() => setOpen(true)}>+ Add New Case</Button>
            {/* <Button
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              onClick={(e) => handleManualMessage(e)}
            >
              <MessageCircle className="w-5 h-5" />
              {handleWhatsappLoading ? "Loading..." : "SEND WHATSAPP"}
            </Button> */}
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
                    checked={
                      selectedCaseIds.length === cases.length && cases.length > 0
                    }
                    onChange={(e) =>
                      setSelectedCaseIds(
                        e.target.checked
                          ? cases.map((caseItem) => caseItem.id)
                          : []
                      )
                    }
                  />
                </TableHead>
                <TableHead>No</TableHead>
                <TableHead>CNR Number</TableHead>
                <TableHead>Case Number</TableHead>
               
                <TableHead>Respondents</TableHead>
                <TableHead>Respondent Advocates</TableHead>

                <TableHead>Petitioners</TableHead>
                <TableHead>Petitioner’s Advocates</TableHead>
                <TableHead>Next Hearing Date</TableHead>
                <TableHead>Valid & Approved</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : cases.length > 0 ? (
                cases.map((caseItem, index) => {
                  // Parse JSON strings to arrays
                  const petitioners = JSON.parse(caseItem.petitioners || "[]").join(", ");
                  const respondents = JSON.parse(caseItem.respondents || "[]").join(", ");
                  const respondentAdvocates = JSON.parse(caseItem.respondent_advocates || "[]").join(", ");

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
                      <TableCell>{petitioners || "N/A"}</TableCell>
                      <TableCell>{caseItem?.petitioner_advocates || "N/A"}</TableCell>
                      <TableCell>{respondents || "N/A"}</TableCell>
                      <TableCell>{respondentAdvocates || "N/A"}</TableCell>
                      <TableCell>
                        
                      { formatToNextDayIST(caseItem.next_date) }


                      </TableCell>
                      <TableCell
                        className={`font-bold ${
                          caseItem.is_approved ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {caseItem.is_approved ? "Approved" : "Not Approved"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3">
                          {!caseItem.is_approved && (
                            <Pencil
                              className="cursor-pointer text-blue-500 hover:text-blue-700"
                              onClick={() => {
                                setSelectedCase(caseItem);
                                setUpdateModalOpen(true);
                              }}
                            />
                          )}
                          {/* <Send
                            onClick={() => handleSendWhatsApp(caseItem)}
                            className="cursor-pointer text-green-500 hover:text-green-700"
                          /> */}
                          <Trash2
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setId(caseItem.id);
                            }}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No cases found.
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

        {/* Add Case Modal */}
        <AddCaseModal fetchCases={fetchCases} open={open} close={setOpen} />

        {/* Delete Case Modal */}
        <DeleteCaseModel
          open={isDeleteModalOpen}
          setOpen={setDeleteModalOpen}
          id={id}
          fetchCases={fetchCases}
        />

        {/* Update Case Modal */}
        {isUpdateModalOpen && (
          <UpdateCaseModal
            open={isUpdateModalOpen}
            close={() => {
              setUpdateModalOpen(false);
              setSelectedCase(null);
            }}
            fetchCases={fetchCases}
            caseData={selectedCase}
          />
        )}
      </div>
    </>
  );
};

export default CaseTable;