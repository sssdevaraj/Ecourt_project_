const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const redisClient = require('./sqlDb/redisKV.js');
const worker = require('./workers/whatsappWorker');

// MARK: - MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: true, credentials: true, }));
require("./whatsapp/job/whatsappCron.js")



// MARK: - Auth ROUTES
app.use("/api/v1/",routes);


app.listen(3000, () => {console.log('Listening to port 3000');});
