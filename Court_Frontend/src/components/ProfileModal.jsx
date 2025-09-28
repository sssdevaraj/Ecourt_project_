// import { useEffect, useState } from "react";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import axiosClient from "@/api/axios";
// import { toast, Toaster } from "sonner";
// import axios from "axios";

// const categories = ["USER", "ADVOCATE", "OFFICE_PROFESSIONAL"];
// const professions = ["Corporate Sector", "Private Sector", "Public Sector"];

// const ProfileModal = ({ isOpen, onClose, userId }) => {
//   const [userData, setUserData] = useState([{
//     first_name: "",
//     last_name: "",
//     state: "",
//     district: "",
//     address: "",
//     pincode: "",
//     city: "",
//     email: "",
//     mobile_number: "",
//     category: "",
//     profession: "",
//     // password: "", // Added password field
//   }]);

//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [pincodeError, setPincodeError] = useState(""); 

//   useEffect(() => {
//     if (isOpen && userId) {
//       fetchUserData();
//       fetchStates();
//     }
//   }, [isOpen, userId]);

//   const fetchUserData = async () => {
//     try {
//       const response = await axiosClient.get(`/auth/user/${userId}`);
//       if (response.status === 200) {
//         setUserData(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       toast.error("Failed to load user data.");
//     }
//   };

//   const fetchStates = async () => {
//     try {
//       const response = await axios.post("/api/phoenix/district-court/states");
//       setStates(response.data.states.map(state => ({ name: state.name, id: state.id })));
//     } catch (error) {
//       console.error("Error fetching states:", error);
//       toast.error("Failed to fetch states.");
//     }
//   };

//   const fetchDistricts = async (stateId) => {
//     try {
//       const response = await axios.post("/api/phoenix/district-court/districts", { stateId });
//       setDistricts(response.data.districts.map(district => ({ label: district.name, value: district.name })));
//     } catch (error) {
//       console.error("Error fetching districts:", error);
//       toast.error("Failed to fetch districts.");
//     }
//   };

//   const handleStateChange = (e) => {
//     const selectedState = e.target.value;
//     setUserData([{ ...userData[0], state: selectedState }]);
//     const stateObj = states.find(state => state.name === selectedState);
//     if (stateObj) {
//       fetchDistricts(stateObj.id);
//     }
//   };

//   const validatePincode = (pincode) => {
//     if (pincode.startsWith("0")) {
//       setPincodeError("Pincode cannot start with 0.");
//       return false;
//     }
//     setPincodeError(""); 
//     return true;
//   };

//   // const validatePassword = (password) => {
//   //   const hasUpperCase = /[A-Z]/.test(password);
//   //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//   //   const hasNumber = /\d/.test(password);
//   //   const isLengthValid = password.length > 6;

//   //   if (!hasUpperCase) {
//   //     toast.error("Password must contain at least one uppercase letter.");
//   //     return false;
//   //   }
//   //   if (!hasSpecialChar) {
//   //     toast.error("Password must contain at least one special character.");
//   //     return false;
//   //   }
//   //   if (!hasNumber) {
//   //     toast.error("Password must contain at least one number.");
//   //     return false;
//   //   }
//   //   if (!isLengthValid) {
//   //     toast.error("Password must be greater than 6 characters.");
//   //     return false;
//   //   }
//   //   return true;
//   // };

//   const handleUpdate = async () => {
//     const { pincode, password } = userData[0];

//     // Validate pincode
//     if (!validatePincode(pincode)) {
//       return;
//     }

   
//     try {
//       setIsLoading(true);
//       const response = await axiosClient.put(`/auth/update-user/${userId}`, userData[0]);
//       if (response.status === 200) {
//         toast.success("Profile updated successfully!");
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Failed to update profile.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//       <Toaster richColors />
//       <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <DialogPanel className="relative w-full max-w-md rounded-xl bg-white shadow-2xl max-h-[80vh] flex flex-col">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="text-xl font-semibold text-gray-900">Update Profile</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
//               <XMarkIcon className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="p-4 overflow-y-auto flex-1">
//             <label className="block text-gray-700">First Name</label>
//             <input type="text" value={userData[0].first_name} disabled className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed" />

//             <label className="block text-gray-700 mt-2">Last Name</label>
//             <input type="text" value={userData[0].last_name} disabled className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed" />

//             {/* <label className="block text-gray-700 mt-2">Mobile Number</label>
//             <input type="text" value={userData[0].mobile_number} onChange={(e) => setUserData([{ ...userData[0], mobile_number: e.target.value }])} className="w-full border rounded-lg px-3 py-2" /> */}

//             <label className="block text-gray-700 mt-2">Email</label>
//             <input type="email" value={userData[0].email} onChange={(e) => setUserData([{ ...userData[0], email: e.target.value }])} className="w-full border rounded-lg px-3 py-2" />

//             <label className="block text-gray-700 mt-2">Address</label>
//             <textarea value={userData[0].address} onChange={(e) => setUserData([{ ...userData[0], address: e.target.value }])} className="w-full border rounded-lg px-3 py-2" />

//             <label className="block text-gray-700 mt-2">Pincode</label>
//             <input
//               type="number"
//               value={userData[0].pincode}
//               onChange={(e) => {
//                 const newPincode = e.target.value;
//                 setUserData([{ ...userData[0], pincode: newPincode }]);
//                 validatePincode(newPincode); // Real-time validation
//               }}
//               className={`w-full border rounded-lg px-3 py-2 ${pincodeError ? "border-red-500" : ""}`}
//               placeholder="Enter pincode"
//             />
//             {pincodeError && <p className="text-red-500 text-sm mt-1">{pincodeError}</p>}

//             <label className="block text-gray-700 mt-2">State</label>
//             <select value={userData[0].state} onChange={handleStateChange} className="w-full border rounded-lg px-3 py-2">
//               <option value="">Select State</option>
//               {states.map((state) => <option key={state.id} value={state.name}>{state.name}</option>)}
//             </select>

//             <label className="block text-gray-700 mt-2">District</label>
//             <select value={userData[0].district} onChange={(e) => setUserData([{ ...userData[0], district: e.target.value }])} className="w-full border rounded-lg px-3 py-2">
//               <option value="">Select District</option>
//               {districts.map((district) => <option key={district.value} value={district.value}>{district.label}</option>)}
//             </select>

//             <label className="block text-gray-700 mt-2">Profession</label>
//             <select value={userData[0].profession} onChange={(e) => setUserData([{ ...userData[0], profession: e.target.value }])} className="w-full border rounded-lg px-3 py-2">
//               <option value="">Select Profession</option>
//               {professions.map((profession) => <option key={profession} value={profession}>{profession}</option>)}
//             </select>

//             <label className="block text-gray-700 mt-2">Category</label>
//             <select value={userData[0].category} onChange={(e) => setUserData([{ ...userData[0], category: e.target.value }])} className="w-full border rounded-lg px-3 py-2">
//               <option value="">Select Category</option>
//               {categories.map((category) => <option key={category} value={category}>{category}</option>)}
//             </select>

//           </div>

//           <div className="p-4 border-t">
//             {isLoading ? (
//               <button disabled className="w-full bg-gray-500 text-white py-2.5 rounded-lg font-medium">Updating...</button>
//             ) : (
//               <button onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">Update Profile</button>
//             )}
//           </div>
//         </DialogPanel>
//       </div>
//     </Dialog>
//   );
// };

// export default ProfileModal;

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axiosClient from "@/api/axios";
import { toast, Toaster } from "sonner";
import commonServices from "@/services/common";

const categories = ["USER", "ADVOCATE", "OFFICE_PROFESSIONAL"];
const professions = ["Corporate Sector", "Private Sector", "Public Sector"];

const ProfileModal = ({ isOpen, onClose, userId }) => {
  const [userData, setUserData] = useState([{
    first_name: "",
    last_name: "",
    state: "",
    district: "",
    address: "",
    pincode: "",
    city: "",
    email: "",
    mobile_number: "",
    category: "",
    profession: "",
  }]);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState(""); 

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
      fetchStates();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(`/auth/user/${userId}`);
      if (response.status === 200) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    }
  };

  const fetchStates = async () => {
    try {
      const statesData = await commonServices.fetchStates();
      setStates(statesData);
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to fetch states.");
    }
  };

  const fetchDistricts = async (stateName) => {
    try {
      const districtsData = await commonServices.fetchDistricts(stateName, states);
      console.log("districtsData", districtsData) 
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to fetch districts.");
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setUserData([{ ...userData[0], state: selectedState }]);
    if (selectedState) {
      fetchDistricts(selectedState);
    }
  };

  const validatePincode = (pincode) => {
    if (pincode.startsWith("0")) {
      setPincodeError("Pincode cannot start with 0.");
      return false;
    }
    setPincodeError(""); 
    return true;
  };

  const handleUpdate = async () => {
    const { pincode } = userData[0];

    // Validate pincode
    if (!validatePincode(pincode)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosClient.put(`/auth/update-user/${userId}`, userData[0]);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <Toaster richColors />
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md rounded-xl bg-white shadow-2xl max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Update Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <label className="block text-gray-700">First Name</label>
            <input type="text" value={userData[0].first_name} disabled className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed" />

            <label className="block text-gray-700 mt-2">Last Name</label>
            <input type="text" value={userData[0].last_name} disabled className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed" />

            <label className="block text-gray-700 mt-2">Email</label>
            <input type="email" value={userData[0].email} onChange={(e) => setUserData([{ ...userData[0], email: e.target.value }])} className="w-full border rounded-lg px-3 py-2" />

            <label className="block text-gray-700 mt-2">Address</label>
            <textarea value={userData[0].address} onChange={(e) => setUserData([{ ...userData[0], address: e.target.value }])} className="w-full border rounded-lg px-3 py-2" />

            <label className="block text-gray-700 mt-2">Pincode</label>
            <input
              type="number"
              value={userData[0].pincode}
              onChange={(e) => {
                const newPincode = e.target.value;
                setUserData([{ ...userData[0], pincode: newPincode }]);
                validatePincode(newPincode); // Real-time validation
              }}
              className={`w-full border rounded-lg px-3 py-2 ${pincodeError ? "border-red-500" : ""}`}
              placeholder="Enter pincode"
            />
            {pincodeError && <p className="text-red-500 text-sm mt-1">{pincodeError}</p>}

            <label className="block text-gray-700 mt-2">State</label>
            <select value={userData[0].state} onChange={handleStateChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select State</option>
              {states.map((state) => <option key={state.id} value={state.name}>{state.name}</option>)}
            </select>

            <label className="block text-gray-700 mt-2">District</label>
            <select value={userData[0].district} onChange={(e) => setUserData([{ ...userData[0], district: e.target.value }])} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select District</option>
              {districts.map((district) =>  <option key={district.name} value={district.name}>{district.name}</option>) }
            </select>

            <label className="block text-gray-700 mt-2">Profession</label>
            <select value={userData[0].profession} onChange={(e) => setUserData([{ ...userData[0], profession: e.target.value }])} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Profession</option>
              {professions.map((profession) => <option key={profession} value={profession}>{profession}</option>)}
            </select>

            <label className="block text-gray-700 mt-2">Category</label>
            <select value={userData[0].category} onChange={(e) => setUserData([{ ...userData[0], category: e.target.value }])} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Category</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div className="p-4 border-t">
            {isLoading ? (
              <button disabled className="w-full bg-gray-500 text-white py-2.5 rounded-lg font-medium">Updating...</button>
            ) : (
              <button onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">Update Profile</button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProfileModal;