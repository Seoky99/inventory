require("dotenv").config(); 

const express = require('express');
const indexRouter = require("./src/routes/indexRouter");
const path = require("node:path");

const app = express(); 

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "src", "views"));

const assetsPath = path.join(__dirname, "src", "public"); 
app.use(express.static(assetsPath));

app.use("/", indexRouter);

app.use( (req, res) => {
    res.status(404).send("404 error");
});

app.use( (err, req, res, next) => {
    res.status(500).send("DUMBASS"); 
});

app.listen(process.env.PORT, () => {
    console.log("Express app running!");
});