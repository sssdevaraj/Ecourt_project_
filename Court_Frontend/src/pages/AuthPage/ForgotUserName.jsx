import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosClient from "@/api/axios";

const ForgotUserName = ({ open, close }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();  
    e.stopPropagation(); 
    setLoading(true);

    try {
      const response = await axiosClient.post("/auth/forgort-password", { email })

      const {status, message} = response.data

      if (status) {
        toast.success(message);
        setEmail("");
        close(); 
      } else {
        toast.error(message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster  richColors />
      <Dialog open={open} onClose={close} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="p-5 bg-white rounded-lg shadow-xl sm:w-full sm:max-w-md">
              <h2 className="text-lg font-semibold text-gray-700">Forgot Username</h2>

              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 mt-4">
                <label> Enter your Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ForgotUserName;
