import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import axiosClient from "@/api/axios";

const ResetPassword = () => {
    const { token } = useParams();
  
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({

        newPassword: "",
        confirmPassword: ""
    });


    // Helper function to validate password
    const validatePassword = (password) => {
        let isValid = true;
        let error = "";

        if (!password) {
            error = "Password is required";
            isValid = false;
        } else if (password.length < 8) {
            error = "Password must be at least 8 characters";
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            error = "At least one uppercase letter required";
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            error = "At least one lowercase letter required";
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            error = "At least one number required";
            isValid = false;
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            error = "At least one special character required";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, newPassword: error }));
        return isValid;
    };

    const validateConfirmPassword = (confirmPass) => {
        let isValid = true;
        let error = "";

        if (!confirmPass) {
            error = "Please confirm your password";
            isValid = false;
        } else if (confirmPass !== newPassword) {
            error = "Passwords do not match";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, confirmPassword: error }));
        return isValid;
    };

    const handleResetPassword = async () => {
        // Validate all fields
        
        const isPasswordValid = validatePassword(newPassword);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if ( !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        try {
            const response = await axiosClient.post("/auth/reset-password", {
                token,
               
                newPassword,
            });

            const { status, message } = response.data;

            if (status) {
                toast.success(message);
                
              
                setNewPassword("");
                setConfirmPassword("");
                setErrors({
                  
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Server error. Try again later!");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <Toaster richColors />
            <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>

             

                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            validatePassword(e.target.value);
                        }}
                        onBlur={() => validatePassword(newPassword)}
                        className={`w-full p-2 text-black rounded border ${errors.newPassword ? "border-red-500" : "border-gray-600"}`}
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (newPassword) validateConfirmPassword(e.target.value);
                        }}
                        onBlur={() => validateConfirmPassword(confirmPassword)}
                        className={`w-full p-2 text-black rounded border ${errors.confirmPassword ? "border-red-500" : "border-gray-600"}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <Button
                    onClick={handleResetPassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Reset Password
                </Button>
            </div>
        </div>
    );
};

export default ResetPassword;