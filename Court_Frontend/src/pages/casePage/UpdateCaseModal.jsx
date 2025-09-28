import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import commonServices from "../../services/common";
import axiosClient from "@/api/axios";
import { toast, Toaster } from "sonner";

const UpdateCaseModal = ({ open, close, fetchCases, caseData }) => {
  const [courtComplexes, setCourtComplexes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    cnr_number: "",
    case_number: "",
    court_complex: "tettet",
    case_id : ""
  });

  // Update form data when `caseData` changes
  useEffect(() => {
    if (caseData) {
      setFormData({
        user_id: caseData.user_id || "",
        cnr_number: caseData.cnr_number || "",
        case_number: caseData.case_number || "",
        court_complex: caseData.court_complex || "",
        case_id : caseData.id
      });
    }
  }, [caseData]);

  // Fetch court complexes
  useEffect(() => {
    const fetchCourtComplexes = async () => {
      try {
        const complexesData = await commonServices.getCourtComplexOld();
        setCourtComplexes(complexesData?.complexes || []);
      } catch (error) {
        console.error("Error fetching court complexes:", error);
      }
    };
    fetchCourtComplexes();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post("/cases/update-case", formData);
      if (response.data.status) {
        await fetchCases();
        toast.success(response.data.message);
        close();
      } else {
        toast.error("Failed to update case.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      <Toaster richColors />
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Update Case</h2>
            <button
              onClick={() => close()}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">CNR Number</Label>
              <Input
                type="text"
                name="cnr_number"
                value={formData.cnr_number}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Case Number</Label>
              <Input
                type="text"
                name="case_number"
                value={formData.case_number}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Court Complex</Label>
              <select
                name="court_complex"
                value={formData.court_complex}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                
              >
                <option value="">Select Court Complex</option>
                {courtComplexes.map((complex) => (
                  <option key={complex.id} value={complex.name}>
                    {complex.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={() => close()}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Case"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default UpdateCaseModal;
