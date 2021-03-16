const express = require('express');
const router = express.Router();

//express routes
router.get('/', (req, res) => {
    res.status(200).json({ success: true, msg: 'get all bootcamps from database' })
})

router.get('/:id', (req, res) => {
    res.status(200).json({ success: true, msg: `get single bootcamp with id ${req.params.id}` })
})

router.post('/', (req, res) => {
    res.status(200).json({ success: true, msg: 'Create new bootcamp' })
})

router.put('/:id', (req, res) => {
    res.status(201).json({ success: true, msg: `updated bootcamp with id ${req.params.id}` })
})

router.delete('/:id', (req, res) => {
    res.status(200).json({ success: true, msg: `delete bootcamp with id ${req.params.id}` })
})

module.exports = router;