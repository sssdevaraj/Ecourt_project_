const router = require('express').Router()

const planController = require("./plan.controller.js")

router.get("/list-plan", planController.getPlans)

module.exports = router;