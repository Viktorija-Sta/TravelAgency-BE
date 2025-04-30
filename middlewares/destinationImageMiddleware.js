const defaultImage = require('../public/default.jpg')

const destinationImageMiddleware = (req, res, next) => {
    if(!req.body.images || req.body.images.length === 0) {
        req.body.images = [defaultImage]
    }
    next()
}

module.exports = destinationImageMiddleware