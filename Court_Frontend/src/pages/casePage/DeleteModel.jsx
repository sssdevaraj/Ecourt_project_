import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import axiosClient from "@/api/axios";

const DeleteCaseModel = ({ open, setOpen, id,fetchCases}) => {
  const handleDelete = async () => {
    try {
      const response = await axiosClient.delete(`/cases/delete/${id}`);
      if (response.status === 200) {
        toast.success("Case Deleted Successfully");
        setOpen(false);
        fetchCases()
       
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      toast.error("Failed to delete case.");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <Toaster richColors />
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            Delete Case
          </h2>

          {/* Confirmation Message */}
          <p className="text-gray-700 text-center mt-4">
            Are you sure you want to delete this case? This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DeleteCaseModel;
