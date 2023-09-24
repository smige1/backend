const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { default: mongoose } = require("mongoose");


const createProduct = asyncHandler(async (req, res) => {
   const {
    name,
    sku,
    category,
    brand,
    color,
    sold,
    regularPrice,
    quantity,
    price,
    description,
    image,
    ratings,
   } = req.body
   if (!name || !category || !brand || !quantity || !price || !description) {
    res.status(400)
        throw new Error("Please fill in all fields");
   }
   const product = await Product.create({
    name,
    sku,
    category,
    brand,
    color,
    sold,
    regularPrice,
    quantity,
    price,
    description,
    image,
    ratings,
   })

   res.status(201).json(product)
})


//get products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort("-createdAt")
    res.status(201).json(products)
})

//get products
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.status(200).json(product)
})

//delete products
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({message: "Product deleted"})
})

//get products
const updateProduct = asyncHandler(async (req, res) => {
    const {
     name,
     category,
     brand,
     color,
     sold,
     regularPrice,
     quantity,
     price,
     description,
     image,
     ratings,
    } = req.body
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    //update product
    const updatedProduct = await Product.findByIdAndUpdate(
        {_id: req.params.id },
        {
            name,
            category,
            brand,
            color,
            sold,
            regularPrice,
            quantity,
            price,
            description,
            image,
            ratings,
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json(updatedProduct)
})

//delete products
const reviewProduct = asyncHandler(async (req, res) => {
    const {
        star,
        review,
       reviewDate,
       
       } = req.body
       const {id}= req.params

       if (star < 1 || !review) {
        res.status(404);
        throw new Error("Product not found");
       }
    const product = await Product.findById(id)
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    product.ratings.push(
        {
            star, review, reviewDate, name: req.user.name, userID: req.user._id
        }
      
    )
    product.save()
    res.status(201).json({message: "Product review added."})
})

//delete products
const deleteReview = asyncHandler(async (req, res) => {
    const {userID} = req.body
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    const newRatings = product.ratings.filter((rating) => {
        return rating.userID.toString() !== userID.toString()
    })
    product.ratings = newRatings
    product.save()
    res.status(200).json({message: "Product Review deleted"})
    })

    //delete products
const updateReview = asyncHandler(async (req, res) => {
    const {
        star,
        review,
       reviewDate,
       
       } = req.body
       const {id} = req.params

       if (star < 1 || !review) {
        res.status(404);
        throw new Error("Product not found");
       }
    const product = await Product.findById(id)
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (req.user._id.toString() !== userID){
    res.status(404);
        throw new Error("User not Autorized");
        }
        
      const updatedReview = await Product.findOneAndUpdate(
        {
            _id: product._id, "ratings.userID": mongoose.Types.ObjectId(userID)
        },
        {
            $set: {"ratings.$.star": star,
            "ratings.$.review": review,
            "ratings.$.reviewDate": reviewDate,}
        }
        
      )
            if (updatedReview) {
                res.status(201).json({message: "Product review Updated."})
            }else {
                res.status(400).json({message: "Product review NOT Updated."})
            }
            
        })
module.exports = {createProduct, getProducts, getProduct, deleteProduct, updateProduct, reviewProduct, deleteReview, updateReview}