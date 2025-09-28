const express = require('express');
const router = express.Router();
//all routes
const authRouter = require("../auth/auth.routes.js");
const FeedBackRouter = require('../feedBack/feedBack.routes.js')
const complainRouter = require("../complaints/complaints.routes.js");
const planRouter = require("../plans/plans.routes.js")
const transactionRouter = require("../transaction/transaction.routes.js")
const MobileMaintenanceRouter = require('../mobile-maintainance/mobile-maintainance.routes.js')
const caseRouter = require("../cases/cases.routes.js")
const whatsappRouter = require("../whatsapp/routes/whatsapp.routes.js")
const  apiRouter = require("../Apis/Api.routes.js")

router.use("/auth", authRouter);
router.use("/feedback", FeedBackRouter)
router.use("/admin/feedbacks", FeedBackRouter)
router.use("/complaint", complainRouter)
router.use("/plans",planRouter )
router.use("/transactions", transactionRouter)
router.use("/mobile-maintainance", MobileMaintenanceRouter)
router.use("/cases", caseRouter)
router.use("/whatsapp", whatsappRouter)
router.use("/api", apiRouter)


module.exports = router;
