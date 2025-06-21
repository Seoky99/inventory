require("dotenv").config(); 

const express = require('express');
const indexRouter = require("./src/routes/indexRouter");

const app = express(); 

app.get("/", indexRouter);



app.listen(process.env.PORT, () => {
    console.log("Express app running!");
}) 