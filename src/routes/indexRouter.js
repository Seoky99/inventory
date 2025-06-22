const { Router } = require("express"); 
const indexController = require("../controllers/indexController");

const indexRouter = Router(); 

indexRouter.get("/:category", indexController.getCategory);
indexRouter.get("/", indexController.getIndex);

module.exports = indexRouter;