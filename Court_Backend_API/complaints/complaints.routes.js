const router = require('express').Router()

const complaintsController = require('./complaints.controller.js')

router.post("/", complaintsController.postComplain)
router.get("/:user_id", complaintsController.getComplaintsOnUserId)
router.post("/admin/verify-complain", complaintsController.verifyComplain)

router.get("/admin/complaints", complaintsController.getAllComplaints)


module.exports = router
