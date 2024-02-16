const Author = require('../models/author')
const asyncHandler = require('express-async-handler')
const Book = require('../models/book')
const { body, validationResult } = require('express-validator')

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
	res.render("author_form", { title: "Create Author"})
})

// display author create on POST
exports.author_create_post = [
	// validate and sanitize fields
	body("first_name")
		.trim()
		.isLength({ min: 1})
		.escape()
		.withMessage("First name must be specified")
		.isAlphanumeric()
		.withMessage("First name has non-alphanumeric characters"),
	body("family_name")
		.trim()
		.isLength({ min: 1})
		.escape()
		.withMessage("Family name must be specified")
		.isAlphanumeric() // dont use usually since names w/ other character sets
		.withMessage("Family name has non-alphanumeric characters"),
	body("date_of_birth", "Invalid date of birth")
		.optional({ values: 'falsy'})
		.isISO8601()
		.toDate(),
	body("date_of_death", "Invalid date of death")
		.optional({ values: 'falsy'})
		.isISO8601()
		.toDate(),
	// Process request after validation and sanitization
	asyncHandler(async (req, res,next) => {
		// extract validation errs from req
		const errors = validationResult(req)

		const author = new Author({
			first_name: req.body.first_name,
			family_name: req.body.family_name,
			date_of_birth: req.body.date_of_birth,
			date_of_death: req.body.date_of_death,
		})

		if (!errors.isEmpty()) {
			res.render("author_form", {
				title: "Create Author",
				author: author,
				errors: errors.array(),
			})
			return
		} else {
			await author.save()
			res.redirect(author.url)
		}
	})
]

// display author delete form on GET 
exports.author_delete_get = asyncHandler(async (req, res,next) => {
	// get details of author and all their books in parallel
	const [author, allBooksByAuthor ] = await Promise.all([
		Author.findById(req.params.id).exec(),
		Book.find({author: req.params.id}, "title summary").exec()
	])

	if (author === null) {
		res.redirect('/catalog/authors')
	}

	res.render("author_delete", {
		title: "Delete Author",
		author: author,
		author_books: allBooksByAuthor
	})
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