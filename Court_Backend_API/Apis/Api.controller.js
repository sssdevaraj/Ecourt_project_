const axios = require('axios');

const ApiControlelr = {
    async fetchCases(req, res) {
        try {
            // const statesdata = await axios.post('https://phoenix.akshit.me/district-court/states'); 
            const statesdata = await axios.post('https://apis.akshit.net/phoenix/district-court/states');
            
            console.log("statesdata", statesdata.data)


            let states = statesdata.data;

            return  res.json( {success: true , message: "Cases fetched successfully", states}); 
        } catch (error) {
            console.error("🔥 Error in getCases:", error);
        }
    },

    async fetchDistrict(req, res) {
        const {stateId} = req.body
       
        try {
            const statesdata = await axios.post('https://apis.akshit.net/phoenix/district-court/districts', {stateId}); 
            console.log("state data", statesdata.data)
            let states = statesdata.data;
           
            return  res.json( {success: true , message: "Cases fetched successfully", states}); 
        } catch (error) {
            console.error("🔥Error in getCases:", error);
        }
    },
    async fetchCourtComplexOld(req, res) {

        console.log("enter")

        try {
            const statesdata = await axios.post('https://apis.akshit.net/phoenix/district-court/complexes', { all: true }); 
            let courtComplex = statesdata.data;
            return  res.json( {success: true , message: "Cases fetched successfully", courtComplex}); 
        } catch (error) {
            console.error("🔥 Error in getCases:", error);
        }
    },

    async fetchCourtComplex(req, res) {

        const {districtId} = req.body
        try {
            const statesdata = await axios.post('https://apis.akshit.net/phoenix/district-court/complexes', { districtId: districtId }); 
            let courtComplex = statesdata.data;
            return  res.json( {success: true , message: "Cases fetched successfully", courtComplex}); 
        } catch (error) {
            console.error("🔥 Error in getCases:", error);
        }
    },

    async fetchCasesType(req, res) {
        try {
            const statesdata = await axios.post('https://phoenix.akshit.me/delhi-high-court/case-types'); 
            let caseTypes = statesdata.data;
            return  res.json( {success: true , message: "Cases fetched successfully", caseTypes}); 
        } catch (error) {   
            console.error("🔥 Error in getCases:", error)    
        };
    }

    ,
    async fetchCourtEstablishment(req, res){

        const {districtId} = req.body
        
        try {
            const statesdata = await axios.post('https://apis.akshit.net/phoenix/district-court/courts', { districtId: districtId }); 
            console.log("statesdata", statesdata)
            let court_establishment = statesdata.data;
            return  res.json( {success: true , message: "Court Establishment fetched successfully", court_establishment}); 
        } catch (error) {
            console.error("🔥 Error in getCases:", error);
        }

    }
}

module.exports = ApiControlelr;

