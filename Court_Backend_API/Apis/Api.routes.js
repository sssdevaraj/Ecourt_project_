const exprsee = require("express");
const ApiControlelr = require("./Api.controller.js")

const  router = require('express').Router()


router.post("/fetch-state", ApiControlelr.fetchCases)

router.post("/fetch-district", ApiControlelr.fetchDistrict)

router.post("/court-complex", ApiControlelr.fetchCourtComplex) 


router.post("/court-complex", ApiControlelr.fetchCourtComplexOld) 

router.post("/v2/court-complex", ApiControlelr.fetchCourtComplex) 

router.post("/case-type", ApiControlelr.fetchCasesType)

router.post("/court-establishment", ApiControlelr.fetchCourtEstablishment)


module.exports = router 