const express = require("express");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct, reviewProduct, deleteReview, updateReview } = require("../controllers/productContoller");
const { adminOnly, Auth } = require("../middleware/authHandler");
const router = express.Router();



//Router PATH
//!Product Related API end Point
router.post("/", Auth, adminOnly, createProduct);
router.patch("/:id", Auth, adminOnly, updateProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", Auth, adminOnly, deleteProduct);
router.patch("/review/:id", Auth, reviewProduct);
router.patch("/deleteReview/:id", Auth, deleteReview);
router.patch("/updateReview/:id", Auth, updateReview);

module.exports = router; 