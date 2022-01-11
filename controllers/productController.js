const Product = require('../models/productModel')
const { getPostData } = require('../utils')

// @desc  Gets All Products
// @route GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll()
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(products))
    } catch (error) {
        console.log(error)
    }
}

// @desc  Get Product by ID
// @route GET /api/product/:id
const getProduct = async (req, res, id) => {
    try {
        const product = await Product.findById(id)
        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found!' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(product))
        }
    } catch (error) {
        console.log(error)
    }
}

// @desc  Post new product
// @route POST /api/products
const createProduct = async (req, res) => {
    try {
        // const product = {
        //     title: product.title,
        //     description: product.description,
        //     price: product.price,
        // }
        const body = await getPostData(req)

        const { title, description, price } = JSON.parse(body)

        const product = {
            title,
            description,
            price,
        }

        const newProduct = await Product.create(product)

        res.writeHead(201, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(newProduct))
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
}
