// import { useState, useEffect, useMemo, useCallback } from "react";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import commonServices from "../../services/common";
// import axiosClient from "@/api/axios";
// import { toast, Toaster } from "sonner";

// const AddCaseModal = ({ open, close, fetchCases }) => {
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [courtComplexes, setCourtComplexes] = useState([]);
//   const [caseTypes, setCaseTypes] = useState([]);
//   const userId = JSON.parse(localStorage.getItem("user"));
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     user_id: userId.userId,
//     country: "India",
//     state: "",
//     district: "",
//     district_id: "",
//     court_complex: "",
//     case_type: "",
//     case_date: "",
//     case_number: "",
//     cnr_number: "",
//   });

//   // Fetch states on component mount
//   useEffect(() => {
//     const fetchStates = async () => {
//       const statesData = await commonServices.fetchStates();
//       setStates(statesData);
//     };
//     fetchStates();
//   }, []);

//   // Fetch districts when state changes
//   useEffect(() => {
//     const fetchDistricts = async () => {
//       if (formData.state) {
//         const districtsResponse = await commonServices.fetchDistricts(
//           formData.state,
//           states
//         );
       
//         // Extract districts from the nested response
//         const districtsData = districtsResponse;
       
//         setDistricts(districtsData);
//       } else {
//         setDistricts([]);
//       }
//     };
//     fetchDistricts();
//   }, [formData.state, states]);

//   // Fetch court complexes when district changes
//   useEffect(() => {
//     const fetchCourtComplexes = async () => {
//       if (formData.district_id) {
//         const complexesData = await commonServices.getCourtComplex(formData.district_id);
//         setCourtComplexes(complexesData?.complexes || []);
//       } else {
//         setCourtComplexes([]);
//       }
//     };
//     fetchCourtComplexes();
//   }, [formData.district_id]);

//   // Fetch case types on component mount
//   useEffect(() => {
//     const fetchCaseTypes = async () => {
//       const caseTypesData = await commonServices.getCaseType();
//       setCaseTypes(caseTypesData);
//     };
//     fetchCaseTypes();
//   }, []);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
    
//     if (name === "district") {
//       const selectedDistrict = districts.find(d => d.name === value);
//       setFormData(prev => ({
//         ...prev,
//         district: value,
//         district_id: selectedDistrict?.id || "",
//         court_complex: "" 
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   }, [districts]);

//   // Memoized options for better performance
//   const stateOptions = useMemo(
//     () =>
//       states.map((state) => (
//         <option key={state.id} value={state.name}>
//           {state.name}
//         </option>
//       )),
//     [states]
//   );

//   const districtOptions = useMemo(
//     () =>
//       districts.map((district) => (
//         <option key={district.id} value={district.name}>
//           {district.name}
//         </option>
//       )),
//     [districts]
//   );

//   const courtComplexOptions = useMemo(
//     () =>
//       courtComplexes.map((complex) => (
//         <option key={complex.id} value={complex.name}>
//           {complex.name}
//         </option>
//       )),
//     [courtComplexes]
//   );

//   const caseTypeOptions = useMemo(
//     () =>
//       caseTypes.map((caseType) => (
//         <option key={caseType.id} value={caseType.name}>
//           {caseType.name}
//         </option>
//       )),
//     [caseTypes]
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await axiosClient.post("/cases/add", formData);
//       if (response.data.status) {
//         await fetchCases();
//         toast.success(response.data.message);
//         close(false);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Something went wrong!";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={() => close(false)} className="relative z-50">
//       <Toaster richColors />
//       <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <DialogPanel className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               Register New Case
//             </h2>
//             <button
//               onClick={() => close(false)}
//               className="text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Country (Default: India) */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium text-gray-700">
//                   Country
//                 </Label>
//                 <Input
//                   value="India"
//                   readOnly
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
//                 />
//               </div>

//               {/* State Dropdown */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="state"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   State
//                 </Label>
//                 <select
//                   id="state"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                 >
//                   <option value="">Select State</option>
//                   {stateOptions}
//                 </select>
//               </div>

//               {/* District Dropdown */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="district"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   District
//                 </Label>
//                 <select
//                   id="district"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                   disabled={!formData.state}
//                 >
//                   <option value="">Select District</option>
//                   {districtOptions}
//                 </select>
//               </div>

//               {/* Court Complex Dropdown */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="court_complex"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Court Complex
//                 </Label>
//                 <select
//                   id="court_complex"
//                   name="court_complex"
//                   value={formData.court_complex}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                   disabled={!formData.district_id}
//                 >
//                   <option value="">Select Court Complex</option>
//                   {courtComplexOptions}
//                 </select>
//               </div>

//               {/* Case Type Dropdown */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="case_type"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Case Type
//                 </Label>
//                 <select
//                   id="case_type"
//                   name="case_type"
//                   value={formData.case_type}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                 >
//                   <option value="">Select Case Type</option>
//                   {caseTypeOptions}
//                 </select>
//               </div>

//               {/* Case Date */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="case_date"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Case Date
//                 </Label>
//                 <Input
//                   id="case_date"
//                   type="date"
//                   name="case_date"
//                   value={formData.case_date}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                 />
//               </div>

//               {/* Case Number */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="case_number"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Case Number
//                 </Label>
//                 <Input
//                   id="case_number"
//                   type="text"
//                   name="case_number"
//                   value={formData.case_number}
//                   onChange={handleChange}
//                   placeholder="Enter case number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                 />
//               </div>

//               {/* CNR Number */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="cnr_number"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   CNR Number
//                 </Label>
//                 <Input
//                   id="cnr_number"
//                   type="text"
//                   name="cnr_number"
//                   value={formData.cnr_number}
//                   onChange={handleChange}
//                   placeholder="Enter CNR number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-4 mt-8">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => close(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
//                   loading
//                     ? "opacity-50 cursor-not-allowed pointer-events-none"
//                     : ""
//                 }`}
//               >
//                 {loading ? "Submitting..." : "Submit Case"}
//               </Button>
//             </div>
//           </form>
//         </DialogPanel>
//       </div>
//     </Dialog>
//   );
// };

// export default AddCaseModal;

import { useState, useEffect, useMemo, useCallback } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import commonServices from "../../services/common";
import axiosClient from "@/api/axios";
import { toast, Toaster } from "sonner";

const AddCaseModal = ({ open, close, fetchCases }) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courtComplexes, setCourtComplexes] = useState([]);
  const [courtEstablishments, setCourtEstablishments] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [courtSelectionType, setCourtSelectionType] = useState(""); // Track radio selection: 'complex' or 'establishment'

  const [formData, setFormData] = useState({
    user_id: userId.userId,
    country: "India",
    state: "",
    district: "",
    district_id: "",
    court_complex: "",
    court_establishment: "",
    case_type: "",
    case_date: "",
    case_number: "",
    cnr_number: "",
  });

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      const statesData = await commonServices.fetchStates();
      setStates(statesData);
    };
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.state) {
        const districtsResponse = await commonServices.fetchDistricts(
          formData.state,
          states
        );
        const districtsData = districtsResponse;
        setDistricts(districtsData);
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [formData.state, states]);

  // Fetch court complexes and establishments when district changes
  useEffect(() => {
    const fetchCourtData = async () => {
      if (formData.district_id) {
        // Fetch court complexes
        const complexesData = await commonServices.getCourtComplex(formData.district_id);
        setCourtComplexes(complexesData?.complexes || []);
        
        // Fetch court establishments
        const establishmentsData = await commonServices.getCourtEstablishment(formData.district_id);

        console.log("court establishment", establishmentsData)
        setCourtEstablishments(establishmentsData || []);
      } else {
        setCourtComplexes([]);
        setCourtEstablishments([]);
      }
    };
    fetchCourtData();
  }, [formData.district_id]);

  // Fetch case types on component mount
  useEffect(() => {
    const fetchCaseTypes = async () => {
      const caseTypesData = await commonServices.getCaseType();
      setCaseTypes(caseTypesData);
    };
    fetchCaseTypes();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        district_id: selectedDistrict?.id || "",
        court_complex: "",
        court_establishment: "",
      }));
      setCourtSelectionType("");
    } else if (name === "court_selection_type") {
      setCourtSelectionType(value);
      setFormData((prev) => ({
        ...prev,
        court_complex: value === "complex" ? prev.court_complex : "",
        court_establishment: value === "establishment" ? prev.court_establishment : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, [districts]);

  // Memoized options for better performance
  const stateOptions = useMemo(
    () =>
      states.map((state) => (
        <option key={state.id} value={state.name}>
          {state.name}
        </option>
      )),
    [states]
  );

  const districtOptions = useMemo(
    () =>
      districts.map((district) => (
        <option key={district.id} value={district.name}>
          {district.name}
        </option>
      )),
    [districts]
  );

  const courtComplexOptions = useMemo(
    () =>
      courtComplexes.map((complex) => (
        <option key={complex.id} value={complex.name}>
          {complex.name}
        </option>
      )),
    [courtComplexes]
  );

  const courtEstablishmentOptions = useMemo(
    () =>
      courtEstablishments.map((establishment) => (
        <option key={establishment.id} value={establishment.name}>
          {establishment.name}
        </option>
      )),
    [courtEstablishments]
  );

  const caseTypeOptions = useMemo(
    () =>
      caseTypes.map((caseType) => (
        <option key={caseType.id} value={caseType.name}>
          {caseType.name}
        </option>
      )),
    [caseTypes]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // // Validate that at least one of court complex or establishment is selected
    // if (!formData.court_complex && !formData.court_establishment) {
    //   toast.error("Please select either Court Complex or Court Establishment");
    //   setLoading(false);
    //   return;
    // }

    console.log(formData)

    try {
      const response = await axiosClient.post("/cases/add", formData);
      if (response.data.status) {
        await fetchCases();
        toast.success(response.data.message);
        close(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => close(false)} className="relative z-50">
      <Toaster richColors />
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Register New Case
            </h2>
            <button
              onClick={() => close(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country (Default: India) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Country
                </Label>
                <Input
                  value="India"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              {/* State Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="state"
                  className="text-sm font-medium text-gray-700"
                >
                  State
                </Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select State</option>
                  {stateOptions}
                </select>
              </div>

              {/* District Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="district"
                  className="text-sm font-medium text-gray-700"
                >
                  District
                </Label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  disabled={!formData.state}
                >
                  <option value="">Select District</option>
                  {districtOptions}
                </select>
              </div>

              {/* Court Selection Radio Buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Court Selection
                </Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      id="court_complex_radio"
                      type="radio"
                      name="court_selection_type"
                      value="complex"
                      checked={courtSelectionType === "complex"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={!formData.district_id}
                    />
                    <label
                      htmlFor="court_complex_radio"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Court Complex
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="court_establishment_radio"
                      type="radio"
                      name="court_selection_type"
                      value="establishment"
                      checked={courtSelectionType === "establishment"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={!formData.district_id}
                    />
                    <label
                      htmlFor="court_establishment_radio"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Court Establishment
                    </label>
                  </div>
                </div>
              </div>

              {/* Court Complex Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="court_complex"
                  className="text-sm font-medium text-gray-700"
                >
                  Court Complex
                </Label>
                <select
                  id="court_complex"
                  name="court_complex"
                  value={formData.court_complex}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={courtSelectionType !== "complex" || !formData.district_id}
                >
                  <option value="">Select Court Complex</option>
                  {courtComplexOptions}
                </select>
              </div>

              {/* Court Establishment Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="court_establishment"
                  className="text-sm font-medium text-gray-700"
                >
                  Court Establishment
                </Label>
                <select
                  id="court_establishment"
                  name="court_establishment"
                  value={formData.court_establishment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={courtSelectionType !== "establishment" || !formData.district_id}
                >
                  <option value="">Select Court Establishment</option>
                  {courtEstablishmentOptions}
                </select>
              </div>

              {/* Case Type Dropdown */}
              {/* <div className="space-y-2">
                <Label
                  htmlFor="case_type"
                  className="text-sm font-medium text-gray-700"
                >
                  Case Type
                </Label>
                <select
                  id="case_type"
                  name="case_type"
                  value={formData.case_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Case Type</option>
                  {caseTypeOptions}
                </select>
              </div> */}

              {/* Case Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="Year"
                  className="text-sm font-medium text-gray-700"
                >
                   Year
                </Label>
                <Input
                  id="case_date"
                  type="text"
                  name="case_date"
                  value={formData.case_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Case Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="case_number"
                  className="text-sm font-medium text-gray-700"
                >
                  Case Number
                </Label>
                <Input
                  id="case_number"
                  type="text"
                  name="case_number"
                  value={formData.case_number}
                  onChange={handleChange}
                  placeholder="Enter case number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* CNR Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="cnr_number"
                  className="text-sm font-medium text-gray-700"
                >
                  CNR Number
                </Label>
                <Input
                  id="cnr_number"
                  type="text"
                  name="cnr_number"
                  value={formData.cnr_number}
                  onChange={handleChange}
                  placeholder="Enter CNR number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => close(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                  loading
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit Case"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddCaseModal;