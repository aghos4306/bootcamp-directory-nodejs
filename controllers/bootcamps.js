const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    
        const bootcamps = await Bootcamp.find()

        if(!bootcamps) {
            //res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        } 
        res.status(200).json({ success: true, data: bootcamps })  
    
})

// @desc        Get single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        
        if(!bootcamp) {
           //return res.status(400).json({ success: false })
           return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, data: bootcamp })

    } catch (err) {
        //res.status(400).json({ success: false })
        //next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        next(err)
    }
}

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = async (req, res, next) => {
    try {
         //console.log(req.body)
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({ success: true, data: bootcamp })
    } catch (err) {
        //res.status(400).json({ success: false })
        next(err)
    }
   
}

// @desc        Update a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp) {
           // return res.status(400).json({ success: false })
           return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ status: true, data: bootcamp })
    } catch (err) {
        //res.status(400).json({ success: false })
        next(err)
    }
    
}

// @desc        Delete a bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if(!bootcamp) {
           // return res.status(200).json({ success: true, data: {} })
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        return res.status(200).json({ success: true, data: {} })
    } catch (err) {
        //res.status(400).json({ success: false })
        next(err)
    }
}