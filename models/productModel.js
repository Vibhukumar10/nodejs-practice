const products = require('../data/products.json')

const findAll = () => {
    return new Promise((resolve, reject) => {
        resolve(products)
    })
}

const findById = (id) => {
    return new Promise((resolve, reject) => {
        const product = products.find((product) => product.id === id)
        resolve(product)
    })
}

module.exports = {
    findAll,
    findById,
}
