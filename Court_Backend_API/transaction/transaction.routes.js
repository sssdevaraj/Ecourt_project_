const router=require('express').Router();
const transactionController = require("./transaction.controller.js")


router.post("/", transactionController.createTransaction)
router.get("/:user_id", transactionController.getTransactionsForUser)
router.get("/admin/transactions", transactionController.getAllTransactions)


// memebership getting ;
router.get("/memebership/:user_id", transactionController.getLastMembershipForUser)

module.exports = router;