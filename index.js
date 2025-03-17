const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


const URL = process.env.DB || "mongodb://127.0.0.1:27017/fsd13";

mongoose.connect(URL);
console.log("Connected to Mongoose Atlas");

const productSchema = new mongoose.Schema({
    title: String,
    price: {
        type: Number,
        required: true,
    }
});

const Product = mongoose.model("product", productSchema);

app.use(express.json());

app.use(cors({
    origin: "*"
}));

let products = [];

app.get("/products", async (req, res) => {
    let products = await Product.find();
    res.json(products);
});

app.get("/product/:id", async (req, res) => {

    let product = await Product.findOne({ _id: req.params.id });
    res.json(product);
})

app.post("/product", async (req, res) => {

    try {
        // let product = new Product({
        //     title: req.body.title,
        //     price: req.body.price
        // })
        // await product.save();

        await Product.create(req.body);

        res.json({ Message: "Product added successfully" });
    } catch (error) {
        res.status(400).json({ Message: error.message });
    }

});

app.put("/product/:id", async (req, res) => {
    await Product.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.json({ Message: "Product Updated successfully" });
})

app.delete("/product/:id", async (req, res) => {
    await Product.findOneAndDelete({ _id: req.params.id });
    res.json({ Message: "Product deleted successfully" });
})

app.listen(3001)