const express = require('express');
const router = express.Router();
const FeedbackController = require("./feedBack.controller.js");

//routes
router.post("/" ,FeedbackController.postFeedBack )
router.get("/:user_id", FeedbackController.getFeedbackOnUserId)
router.get("/", FeedbackController.adminFeedbacks)


module.exports = router