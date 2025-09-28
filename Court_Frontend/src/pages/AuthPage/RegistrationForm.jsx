import React, { useState } from "react";

const RegisterForm = ({
  setIsLogin,
  handleAuth,
  error,
  countries,
  states,
  districts,
  setSelectedCountry,
  setSelectedState,
  setSelectedDistrict,
  setCity,
  setPincode,
  setProfession,
  email,
  setEmail,
  otp,
  setOtp,
  otpSent,
  verified,
  handleSendOtp,
  handleVerifyOtp,
  setMobile_number,
  mobile_number
}) => {
  // Validation states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  // Validation handlers
  const validateName = (name, setError) => {
    if (!/^[A-Za-z\s]*$/.test(name)) {
      setError("Should only contain alphabets and spaces");
      return false;
    }
    setError("");
    return true;
  };

  const validatePincode = (value) => {
    if (value.startsWith("0")) {
      setPincodeError("Pincode cannot start with 0");
      return false;
    }
    if (!/^[1-9][0-9]{5}$/.test(value)) {
      setPincodeError("Must be 6 digits");
      return false;
    }
    setPincodeError("");
    return true;
  };

  const validateUsername = (value) => {
    if (value.length < 3) {
      setUsernameError("Must be at least 3 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(value)) {
      setUsernameError("Only letters, numbers, _ and . allowed");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validatePassword = (value) => {
    let error = "";
    if (value.length < 8) error = "At least 8 characters";
    else if (!/[A-Z]/.test(value)) error = "At least one uppercase letter";
    else if (!/[a-z]/.test(value)) error = "At least one lowercase letter";
    else if (!/[0-9]/.test(value)) error = "At least one number";
    else if (!/[^A-Za-z0-9]/.test(value)) error = "At least one special character";
    
    setPasswordError(error);
    return !error;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let isValid = true;

    // Validate names
    isValid = validateName(formData.get("firstName"), setFirstNameError) && isValid;
    isValid = validateName(formData.get("lastName"), setLastNameError) && isValid;

    // Validate pincode
    isValid = validatePincode(formData.get("pincode")) && isValid;

    // Validate username/password if verified
    if (verified) {
      isValid = validateUsername(formData.get("username")) && isValid;
      isValid = validatePassword(formData.get("password")) && isValid;
    }

    if (isValid) handleAuth(e);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-center">Registration</h1>
      <p className="text-sm text-gray-600 text-center">Enter your details to register</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={`p-3 border rounded-lg w-full ${firstNameError ? "border-red-500" : ""}`}
            required
            onChange={(e) => validateName(e.target.value, setFirstNameError)}
          />
          {firstNameError && <p className="text-red-500 text-sm mt-1">{firstNameError}</p>}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`p-3 border rounded-lg w-full ${lastNameError ? "border-red-500" : ""}`}
            required
            onChange={(e) => validateName(e.target.value, setLastNameError)}
          />
          {lastNameError && <p className="text-red-500 text-sm mt-1">{lastNameError}</p>}
        </div>
      </div>

      <input
        type="text"
        name="address"
        placeholder="Address"
        className="p-3 border rounded-lg"
        required
      />

      <div className="grid grid-cols-3 gap-4">
        <select
          name="country"
          className="p-3 border rounded-lg"
          required
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select
          name="state"
          className="p-3 border rounded-lg"
          required
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <select
          name="district"
          className="p-3 border rounded-lg"
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.value} value={district.value}>{district.label}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        name="city"
        placeholder="City"
        className="p-3 border rounded-lg"
        required
        onChange={(e) => setCity(e.target.value)}
      />

      <div>
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          className={`p-3 border rounded-lg w-full ${pincodeError ? "border-red-500" : ""}`}
          required
          onChange={(e) => validatePincode(e.target.value)}
        />
        {pincodeError && <p className="text-red-500 text-sm mt-1">{pincodeError}</p>}
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="p-3 border rounded-lg"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        name="mobile_number"
        placeholder="mobile_number"
        className="p-3 border rounded-lg"
        required
        value={mobile_number}
        onChange={(e) => setMobile_number(e.target.value)}
      />

      <div className="flex justify-end items-center gap-5">
        <button
          type="button"
          onClick={handleSendOtp}
          className="text-sm text-blue-600"
          disabled={otpSent}
        >
          {otpSent ? "OTP Sent" : "Verify Number"}
        </button>
        <div className="relative">
          <input
            type="text"
            name="otp"
            className="block p-2 w-full text-sm text-gray-900 border rounded-tl-md rounded-bl-md outline-none"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-0 end-0 p-2.5 rounded-tr-md rounded-br-md h-full text-sm font-medium text-white bg-black"
            onClick={handleVerifyOtp}
            disabled={verified}
          >
            ✔
          </button>
        </div>
      </div>

      {verified && (
        <>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={`p-3 border rounded-lg w-full ${usernameError ? "border-red-500" : ""}`}
              required
              onChange={(e) => validateUsername(e.target.value)}
            />
            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
          </div>

          <select
            name="profession"
            className="p-3 border rounded-lg"
            required
            onChange={(e) => setProfession(e.target.value)}
          >
            <option value="">Select Profession</option>
            <option value="Corporate Sector">Corporate Sector</option>
            <option value="Private Sector">Private Sector</option>
            <option value="Public Sector">Public Sector</option>
          </select>

          <select name="category" className="p-3 border rounded-lg" required>
            <option value="">Select Category</option>
            <option value="USER">User</option>
            <option value="ADVOCATE">Advocate</option>
            <option value="OFFICE_PROFESSIONAL">Office Professional</option>
          </select>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`p-3 border rounded-lg w-full ${passwordError ? "border-red-500" : ""}`}
              required
              onChange={(e) => validatePassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white p-3 rounded-lg transition"
        disabled={!verified}
      >
        Sign Up
      </button>

      <p className="text-center text-sm text-black mt-2">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="text-blue-600 underline"
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;