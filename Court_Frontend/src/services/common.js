import axiosClient from "@/api/axios";
import axios, { all } from "axios";
import { toast } from "sonner"; // Ensure you have 'sonner' installed

const commonServices = {
  // Fetch all states
  async fetchStates() {
    try {
      const response = await axiosClient.post(`/api/fetch-state`);
      // setStates();
      return response.data.states.states.map(state => ({ name: state.name, id: state.id }))
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to fetch states.");
      return [];
    }



  },

  // Fetch districts based on selected state
  async fetchDistricts(stateName, states) {
    try {
      const stateObj = states.find((state) => state.name === stateName);
      if (!stateObj) {
        toast.error("Invalid state selected.");
        return [];
      }

      const response = await axiosClient.post("/api/fetch-district", { stateId: stateObj.id });
      console.log("Districts response:", response);

      // Return the raw districts array with id and name
      return response.data.states?.districts || [];
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to fetch districts.");
      return [];
    }
  },

  async getCourtComplex(districtId) {
    try {
      const response = await axiosClient.post(`/api/v2/court-complex`, { districtId: districtId });


      return response.data.courtComplex
    } catch (error) {
      console.error("Error fetching courts:", error);
      toast.error("Failed to fetch courts.");
      return [];
    }
  },


  async getCourtEstablishment(districtId) {
    try {
      var response = await axiosClient.post(`/api/court-establishment`, { districtId: districtId });
      console.log("response", response?.data?.court_establishment?.courts      )

      return response?.data?.court_establishment?.courts 
      
    } catch (error) {
      console.error("Error fetching courts:", error);
      toast.error("Failed to fetch courts.");
      
    }
  },


  async getCourtComplexOld() {
    try {
      const response = await axiosClient.post(`/api/court-complex`);


      return response.data.courtComplex
    } catch (error) {
      console.error("Error fetching courts:", error);
      toast.error("Failed to fetch courts.");
      return [];
    }
  },


  async getCaseType() {
    try {
      const response = await axiosClient.post(`/api/case-type`);
      return response.data.caseTypes.types
    } catch (error) {
      console.error("Error fetching courts:", error);
      toast.error("Failed to fetch courts.");
      return [];
    }
  }

  //   getEcourtComplexes(data=null): Observable<any> {
  //     const API_URL = `${import.meta.env.VITE_AKHITS_API_URL}/district-court/complexes`;
  //     return this.http.post(API_URL,{all:true}).pipe(catchError(this.error));
  //   }
  //   getEcourtCaseType(data=null): Observable<any> {
  //     const API_URL = `${import.meta.env.VITE_AKHITS_API_URL}/delhi-high-court/case-types`;
  //     return this.http.post(API_URL,{}).pipe(catchError(this.error));
  //   }


};

export default commonServices;
