const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
        },
        sku: {
            type: String,
            required: true,
            default: "SKU",
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, "Please add a brand"],
            trim: true,
        },
        color: {
            type: String,
            required: [true, "Please add a color"],
            trim: true,
        },
        sold: {
            type: Number,
            default: 0,
            trim: true,
        },
        regularPrice: {
            type: String,
            trim: true,
        },
        quantity: {
            type: String,
            required: [true, "Please add a quantity"],
            trim: true,
        },
        price: {
            type: String,
            required: [true, "Please add a price"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            trim: true,
        },
        image: {
            type:[String],
        },
        ratings: {
            type:[Object],
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;