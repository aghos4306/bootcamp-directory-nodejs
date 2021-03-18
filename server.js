const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
//Routes files
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });

const app = express();

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

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))