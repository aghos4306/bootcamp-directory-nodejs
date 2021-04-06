const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
       
        let query;

        //copy req.query
        const reqQuery = { ...req.query }

        //fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit']

        // loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param])

        //create query string
        let queryStr = JSON.stringify(reqQuery);

        //create operators ($gt, $gte, $lt etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        //finding resource
        query = Bootcamp.find(JSON.parse(queryStr))

        // select fields
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ') //turn to array and spaced out string
            query = query.select(fields)
        }

        // sort
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // pagination
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 25
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const total = await Bootcamp.countDocuments()

        query = query.skip(startIndex).limit(limit) 

        //execute query
        const bootcamps = await query

        // pagination result
        const pagination = {}

        if(endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit:limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        if(!bootcamps) {
            //res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        } 
        res.status(200).json({ success: true, count:bootcamps.length, pagination, data: bootcamps })  
    
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