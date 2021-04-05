const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
       
        let query;
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Bootcamp.find(JSON.parse(queryStr))

        const bootcamps = await query

        if(!bootcamps) {
            //res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        } 
        res.status(200).json({ success: true, count:bootcamps.length, data: bootcamps })  
    
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

// @desc        Get all bootcamps within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Public
exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //calc radius using radians; docs.mongodb.com/manual/reference/operator/query/centerSphere/
    //get the radius of earth by dividing whatever distance by radius of earth
    //Radius of earth = 6,378km or 3,963 mi
    const radius = distance / 6378
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat], radius] } }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})