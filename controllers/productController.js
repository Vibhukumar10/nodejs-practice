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

        const { name, description, price } = JSON.parse(body)

        const product = {
            name,
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

// @desc  Update existing product
// @route PUT /api/products/:id
const updateProduct = async (req, res, id) => {
    try {
        const product = await Product.findById(id)
        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found!' }))
        } else {
            const body = await getPostData(req)

            const { name, description, price } = JSON.parse(body)

            const productData = {
                name: name || product.name,
                description: description || product.description,
                price: price || product.price,
            }

            const updatedProduct = await Product.update(productData, id)

            res.writeHead(201, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify(updatedProduct))
        }
    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req, res, id) => {
    try {
        const product = await Product.findById(id)
        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found!' }))
        } else {
            await Product.remove(id)
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `Product ${id} Removed!` }))
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}
