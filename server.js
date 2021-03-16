const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const app = express();

//express routes
app.get('/', (req, res) => {
    res.status(200).json({ success: true, data: [{id: 1, text: 'first text'}, {id: 2, text: 'second text'}] })
})

app.get('/app/v1/bootcamps', (req, res) => {
    res.status(200).json({ success: true, msg: 'get all bootcamps from database' })
})

app.get('/app/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({ success: true, msg: `get single bootcamp with id ${req.params.id}` })
})

app.post('/app/v1/bootcamps', (req, res) => {
    res.status(200).json({ success: true, msg: 'Create new bootcamp' })
})

app.put('/app/v1/bootcamps/:id', (req, res) => {
    res.status(201).json({ success: true, msg: `updated bootcamp with id ${req.params.id}` })
})

app.delete('/app/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({ success: true, msg: `delete bootcamp with id ${req.params.id}` })
})

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))