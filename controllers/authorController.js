const Author = require('../models/author')
const asyncHandler = require('express-async-handler')

// display list of all authors
exports.author_list = asyncHandler(async (req,res,next) => {
	res.send('Not implemented: author list')
})

// display detail page for a specific author
exports.author_detail = asyncHandler(async (req, res,next) => {
	res.send(`Not implemented: author detail: ${req.params.id}`)
})

// display author create form on GET
exports.author_create_get = asyncHandler(async (req, res,next) => {
	res.send('Not implemented: author create GET')
})

// display author create on POST
exports.author_create_post = asyncHandler(async (req, res,next) => {
	res.send('Not implemented: author create POST')
})

// display author delete form on GET 
exports.author_delete_get = asyncHandler(async (req, res,next) => {
	res.send('Not implemented: author delete GET')
})

// display author delete form on POST
exports.author_delete_post = asyncHandler(async (req, res,next) => {
	res.send('Not implemented: author delete POST')
})

// display author update form on GET
exports.author_update_get = asyncHandler(async (req, res,next) => {
	res.send('Not implemented: author update GET')
})

// display author update on POST
exports.author_update_post = asyncHandler(async (req, res,next) => {
	res.send('Not implemented: author update POST')
})