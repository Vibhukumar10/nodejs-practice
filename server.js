const http = require('http')
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('./controllers/productController')

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end(
            "<h2>Welcome to Vanilla-Nodejs-API, </h2><ul><li>Go to '/api/products' to get all products</li><li>Go to '/api/products/:id' to get product by Id</li><li>To do functions, such as CREATE, UPDATE and DELETE, use postman</li></ul>"
        )
    } else if (req.url === '/api/products' && req.method === 'GET') {
        getProducts(req, res)
    } else if (
        req.url.match(/\/api\/products\/(\S+)/) &&
        req.method === 'GET'
    ) {
        const id = req.url.split('/')[3]
        getProduct(req, res, id)
    } else if (req.url === '/api/products' && req.method === 'POST') {
        createProduct(req, res)
    } else if (
        req.url.match(/\/api\/products\/(\S+)/) &&
        req.method === 'PUT'
    ) {
        const id = req.url.split('/')[3]
        updateProduct(req, res, id)
    } else if (
        req.url.match(/\/api\/products\/(\S+)/) &&
        req.method === 'DELETE'
    ) {
        const id = req.url.split('/')[3]
        deleteProduct(req, res, id)
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route Not Found!' }))
    }
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
