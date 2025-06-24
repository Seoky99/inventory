const { Router } = require("express"); 
const indexController = require("../controllers/indexController");

const indexRouter = Router(); 

indexRouter.post("/:category/update", indexController.updateItem);
indexRouter.get("/:category/add", indexController.addItemGet);
indexRouter.post("/:category/add", indexController.addItemPost);

indexRouter.get("/:category/:item", indexController.getItem); 
indexRouter.post("/:category/:item/del", indexController.deleteItem);

indexRouter.get("/:category", indexController.getCategory);
indexRouter.get("/", indexController.getIndex);

module.exports = indexRouter;