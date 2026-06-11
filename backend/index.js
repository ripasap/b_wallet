require("dotenv").config();

const express = require('express');
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());


const mainRouter = require("./routes/index");
//! order matters, the main router must be after all the middle wares.


app.use("/api/v1", mainRouter);  


app.listen(process.env.PORT, (req,res) => {
 console.log("listening on port 3000");
})


// app.use("/api/v1/account", mainRouter); 