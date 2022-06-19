var express = require("express");
var router = express.Router();

// Require controller modules.
var item_controller = require("../controllers/itemController");
var category_controller = require("../controllers/categoryController");

/// ITEM ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// POST request for creating item.
router.post("/item/create", item_controller.item_create_post);

// POST request to update item.
router.post("/item/:id/update", item_controller.item_update_post);

// POST request to delete item.
router.delete("/item/:id/delete", item_controller.item_delete_post);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

/*
/// category ROUTES ///

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);
*/
// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all categorys.
router.get("/categories", category_controller.category_list);

module.exports = router;