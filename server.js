const express = require('express');
const dotenv = require('dotenv');
//Routes files
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });

const app = express();

const logger = (req, res, next) => {
    req.hello = 'Hello World'
    console.log('Middleware ran')
    next()
}

app.use(logger)

//Mount routers
app.use('/app/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))