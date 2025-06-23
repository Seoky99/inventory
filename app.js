require("dotenv").config(); 

const express = require('express');
const indexRouter = require("./src/routes/indexRouter");
const formRouter = require("./src/routes/formRouter");
const path = require("node:path");

const app = express(); 

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({extended: true}));

const assetsPath = path.join(__dirname, "src", "public"); 
app.use(express.static(assetsPath));

app.use("/add", formRouter);
app.use("/", indexRouter);

app.use( (req, res) => {
    res.status(404).render("notFound");
});

/*app.use( (err, req, res, next) => {
    res.status(500).send(err.message); 
}); */

app.listen(process.env.PORT, () => {
    console.log("Express app running!");
});