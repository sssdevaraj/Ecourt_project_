const router= require('express').Router()

const MobileMaintenanceController = require("./mobile-maintainance.controller.js")

router.post("/save-number", MobileMaintenanceController.postNumber );
router.post("/number", MobileMaintenanceController.deleteNumber)


module.exports=router