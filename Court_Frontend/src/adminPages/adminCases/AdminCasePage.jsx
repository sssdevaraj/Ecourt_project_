import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/textarea";
import axiosClient from "@/api/axios";

const AdminCaseTable = () => {
  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState("");
  const [selectedCasesData, setSelectedCasesData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const limit = 10;

  const fetchCases = async () => {
    try {
      const response = await axiosClient.get(`/cases/admin/cases?page=${page}&limit=${limit}`);
      if (response.data.status) {
        setCases(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [page]);

  useEffect(() => {
    const allIds = cases.map((item) => item.id);
    const selectedIds = Array.from(selectedCases);
    setSelectAll(allIds.length > 0 && selectedIds.length === allIds.length);
  }, [cases, selectedCases]);

  const handleCheckboxChange = (id) => {
    setSelectedCases((prev) => {
      const newSelected = new Set(prev);
      newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    const allIds = cases.map((item) => item.id);
    if (selectAll) {
      setSelectedCases(new Set());
      console.log("Deselected All");
    } else {
      setSelectedCases(new Set(allIds));
      console.log("Selected All IDs:", allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSendClick = async () => {
    try {
      const response = await axiosClient.post('/cases/admin/cases/batch', {
        ids: Array.from(selectedCases)
      });
      if (response.data.status) {
        setSelectedCasesData(response.data.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching selected cases:', error);
    }
  };

  const generateMessage = (template, caseItem) => {
    let message = template;
    const replacements = {
      cnr_number: caseItem.cnr_number,
      case_number: caseItem.case_number,
      party_name: caseItem.party_name,
      next_date: new Date(caseItem.next_date).toLocaleDateString(),
    };

    Object.entries(replacements).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return message;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Case Management</h1>
        <Button 
          onClick={handleSendClick}
          disabled={selectedCases.size === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          Send WhatsApp Message ({selectedCases.size})
        </Button>
      </div>

      <Toaster />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-12">
                <input 
                  type="checkbox" 
                  checked={selectAll} 
                  onChange={handleSelectAllChange} 
                  className="h-4 w-4"
                />
              </TableHead>
              <TableHead>No</TableHead>
              <TableHead>CNR Number</TableHead>
              <TableHead>Case Number</TableHead>
              <TableHead>Party Name</TableHead>
              <TableHead>Next Hearing Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem, index) => (
              <TableRow key={caseItem.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedCases.has(caseItem.id)}
                    onChange={() => handleCheckboxChange(caseItem.id)}
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell>{index + 1 + (page - 1) * limit}</TableCell>
                <TableCell className="font-medium">{caseItem.cnr_number}</TableCell>
                <TableCell>{caseItem.case_number}</TableCell>
                <TableCell>{caseItem.party_name}</TableCell>
                <TableCell>{new Date(caseItem.next_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${caseItem.is_approved ? 
                    'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {caseItem.is_approved ? "Approved" : "Pending"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-4">
        <Button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-lg font-medium">Page {page}</span>
        <Button onClick={() => setPage((prev) => prev + 1)} variant="outline">
          Next
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Send WhatsApp Messages</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Message Template
                </label>
                <Textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Enter your message template. Use {{variable}} names for dynamic content. Available variables: {{cnr_number}}, {{case_number}}, {{party_name}}, {{next_date}}"
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Message Preview
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {selectedCasesData[0] ? (
                    generateMessage(messageTemplate, selectedCasesData[0])
                  ) : "Select a case to see preview"}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Selected Cases ({selectedCases.size})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedCasesData.map((caseItem) => (
                    <div key={caseItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{caseItem.party_name}</div>
                        <div className="text-sm text-gray-600">
                          {caseItem.phone} • {caseItem.cnr_number}
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const message = generateMessage(messageTemplate, caseItem);
                          const url = `https://wa.me/${caseItem.phone}?text=${encodeURIComponent(message)}`;
                          window.open(url, '_blank');
                        }}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Send
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCaseTable;
