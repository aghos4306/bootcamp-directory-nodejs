const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message
    console.log(err.stack)
    //console.log(err.name)

    //Mongoose bad objectid
    if(err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'server error'
    })
}

module.exports = errorHandler