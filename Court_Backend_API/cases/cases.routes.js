const router = require('express').Router()
const caseController = require("./cases.controller.js")

router.post("/add", caseController.saveAndValidateCase)

//for user 
router.get("/:user_id", caseController.getUserCases)

//admin cases
router.get("/admin/cases", caseController.getAllCases)

//delete case 
router.delete("/delete/:case_id", caseController.deleteCase)

// get case hsotory based on user id 
router.get("/case-history/:user_id", caseController.gtCaseHistory)



// update case of user when cnr_number and case_type matches
router.post("/update-case", caseController.updateCase);


module.exports = router