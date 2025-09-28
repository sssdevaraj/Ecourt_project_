const router= require('express').Router()


const whatsappController = require("../../whatsapp/controllers/whatsapp.controller.js")



router.post("/handle-manual-message", whatsappController.handleManualMessage)





module.exports=router