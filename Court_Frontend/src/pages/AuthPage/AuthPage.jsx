import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import RegisterForm from "./RegistrationForm";
import LoginForm from "./LoginPage";
import Logo from "../../assets/logo.jpeg"
import axiosClient from "@/api/axios";

const AuthPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [countries] = useState(["India"]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [profession, setProfession] = useState("");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [mobile_number, setMobile_number] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCountry === "India") {
      fetchStates();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts();
    }
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      // https://apis.akshit.net
      const response = await axiosClient.post("/api/fetch-state")
      // console.log("response", response.data.states)
 
      setStates(response.data.states.states.map(state => ({ name: state.name, id: state.id })));
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to fetch states.");
    }
  };

  // const fetchStates = async () => {
  //   try {
  //     // https://apis.akshit.net/phoenix/district-court/states
  //     const response = await axios.post('/api/phoenix/district-court/states');
      
  //     setStates(response.data.states.map(state => ({ name: state.name, id: state.id })));
  //   } catch (error) {
  //     console.error("Error fetching states:", error);
  //     toast.error("Failed to fetch states.");
  //   }
  // };

  const fetchDistricts = async () => {
    try {
      const stateObj = states.find(state => state.name === selectedState);
      if (!stateObj) return toast.error("Invalid state selected.");
      
     
      const response = await axiosClient.post("/api/fetch-district", { stateId: stateObj.id });
      console.log("response", response.data.states.districts
      )
      setDistricts(response.data.states.districts.map(district => ({ label: district.name, value: district.name })));
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to fetch districts.");
    }
  };

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email.");

    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { phone_number:mobile_number });
      if (response.data.status) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP.");

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { phone_number:mobile_number, otp });
      if (response.data.status) {
        toast.success("OTP verified successfully!");
        setVerified(true);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };


  const handleAuth = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("district","lucknow");
    formData.append("state","uttarprades");
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await axios.post(
        isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`,
        data,
        { withCredentials: true }
      );
  
      if (response.data.status) {
        toast.success(isLogin ? "Login successful!" : "Registration successful!");
  
        if (isLogin) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              token: response.data.token,
              userId: response.data.user_id,
              role: response.data.role,
              email: response.data.email,
              name: response.data.name,
              free_trial: response.data.free_trial
            })
          );
  
          // Redirect based on role
          navigate(response.data.role === "ADMIN" ? "/admin/cases" : "/user/cases");
        }
      } else if (response.data.message === "Please verify email") {
        toast.error("Your email is not verified. Please verify before logging in.");
        setOtpStatus(true); // Show OTP input
      } else {
        setError(response.data.message);
        toast.error(response.data.message || "Authentication failed.");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setError("Something went wrong. Please try again.");
      toast.error("Server error. Try again later!");
    }
  };
  


  return (
    <div className="w-full h-screen bg-black flex flex-col md:flex-row items-center justify-center p-6 relative">
      <Toaster richColors />
      <div className="md:w-2/5 w-full h-full flex flex-col items-center justify-center text-center md:text-left">
        <h1 className="text-4xl md:text-6xl text-white font-bold"> <img src = {Logo}/> </h1>
      </div>
      <div className="md:w-3/5 w-full h-full flex items-center justify-center">
        {isLogin ? (
          <LoginForm setIsLogin={setIsLogin} handleAuth={handleAuth} error={error} />
        ) : (
          <RegisterForm
            setIsLogin={setIsLogin}
            handleAuth={handleAuth}
            error={error}
            countries={countries}
            states={states.map(state => state.name)}
            districts={districts}
            setSelectedCountry={setSelectedCountry}
            setSelectedState={setSelectedState}
            setSelectedDistrict={setSelectedDistrict}
            city={city}
            setCity={setCity}
            pincode={pincode}
            setPincode={setPincode}
            profession={profession}
            setProfession={setProfession}
            email={email}
            setEmail={setEmail}
            otp={otp}
            setOtp={setOtp}
            otpSent={otpSent}
            verified={verified}
            handleSendOtp={handleSendOtp}
            handleVerifyOtp={handleVerifyOtp}
            setMobile_number={setMobile_number} 
            mobile_number={mobile_number}
            
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
