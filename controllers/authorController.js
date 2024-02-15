const Author = require('../models/author')
const asyncHandler = require('express-async-handler')
const Book = require('../models/book')

// display list of all authors
exports.author_list = asyncHandler(async (req,res,next) => {
	const allAuthors = await Author.find().sort({family_name: 1}).exec()
	res.render("author_list", {
		title: "Author List",
		author_list: allAuthors
	})
})

// display detail page for a specific author
exports.author_detail = asyncHandler(async (req, res,next) => {
	const [author, allBooksByAuthor] = await Promise.all([
		Author.findById(req.params.id).exec(),
		Book.find({ author: req.params.id }, "title summary").exec()
	])

	if (author === null) {
		const err = new Error('Author not found')
		err.status = 404
		return next(err)
	}

	res.render('author_detail', {
		title: "Author Detail",
		author: author,
		author_books: allBooksByAuthor
	})
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