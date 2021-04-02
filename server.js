const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//Load env variables
dotenv.config({ path: './config/config.env' });

//connect to db
connectDB()

//Routes files
const bootcamps = require('./routes/bootcamps');

const app = express();

//Body Parser
app.use(express.json())

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next() 
}

//Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Mount routers
app.use('/app/v1/bootcamps', bootcamps);

//error middleware placed after bootcamp for it to be seen
app.use(errorHandler)

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//handle unhandledPromiseRejectionWarning
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    server.close(() => process.exit(1))
})