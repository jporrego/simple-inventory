const multer = require("multer");
const upload = multer({ dest: "uploads/" });
var cloudinary = require("cloudinary").v2;
const fs = require("fs");
var Item = require("../models/item");
var Category = require("../models/category");
var async = require("async");

const resultHandler = (err) => {
  if (err) {
    console.log("unlink failed", err);
  } else {
    console.log("file deleted");
  }
};

// Display inventory.
exports.index = function (req, res, next) {
  Item.find()
    .sort({ name: 1 })
    .populate("category brand")
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      res.json(result);
    });
};

exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("category brand")
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      if (item == null) {
        // No results.
        var err = new Error("Item");
        err.status = 404;
        return next(err);
      }
      // Successful, so send data.
      res.json(item);
    });
};

exports.item_create_post = async function (req, res, next) {
  if (req.body.name.trim().length === 0) {
    res.status(413).json({
      message: "Name is required",
    });
    return;
  }
  try {
    // 4000000 bytes (4 MB) max size
    //console.log(req.body, req.file);
    if (req.file.size > 6000000) {
      res.status(413).json({
        message: "Image too big. Max size 4MB.",
      });
      fs.unlink(req.file.path, resultHandler);
    } else {
      const imageName = req.body.name.replace(/\s/g, "");
      await cloudinary.uploader.upload(
        req.file.path,
        { public_id: imageName, folder: "coffee-shop-images" },
        function (error, result) {
          console.log(result, error);
        }
      );
      let item = new Item({
        name: req.body.name,
        description: req.body.description,
        brand: req.body.brand,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        img: imageName,
      });
      item.save();
      res.status(201).json(item);
      fs.unlink(req.file.path, resultHandler);
    }
  } catch (error) {
    fs.unlink(req.file.path, resultHandler);
    return next(error);
  }
};

exports.item_update_post = async function (req, res, next) {
  try {
    console.log(req.body);

    let updatedItem = {
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      img: req.body.picture,
    };
    await Item.findOneAndUpdate({ _id: req.params.id }, updatedItem);
    res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
};

exports.item_update_new_img_post = async function (req, res, next) {
  if (req.body.name.trim().length === 0) {
    res.status(413).json({
      message: "Name is required",
    });
    return;
  }
  try {
    if (req.file.size > 6000000) {
      res.status(413).json({
        message: "The image is too big. Max size 6MB.",
      });
      fs.unlink(req.file.path, resultHandler);
    } else {
      await cloudinary.uploader.upload(
        req.file.path,
        { public_id: req.body.name, folder: "coffee-shop-images" },
        function (error, result) {
          console.log(result, error);
        }
      );
      let updatedItem = {
        name: req.body.name,
        description: req.body.description,
        brand: req.body.brand,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        img: req.body.name,
      };
      await Item.findOneAndUpdate({ _id: req.params.id }, updatedItem);
      fs.unlink(req.file.path, resultHandler);
      res.sendStatus(200);
    }
  } catch (error) {
    return next(error);
  }
};

exports.item_delete_post = async function (req, res, next) {
  try {
    await Item.deleteOne({ _id: req.params.id });
    res.end();
  } catch (error) {
    return next(error);
  }
};
