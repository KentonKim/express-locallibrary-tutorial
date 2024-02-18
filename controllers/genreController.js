const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator')

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({name:1}).exec()
  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres
  })
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // get details of genre and all associated books in parallel
  const [ genre, booksInGenre ] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec()
  ])
  if (genre === null) {
    // no results
    const err = new Error('Genre not found')
    err.status = 404
    return next(err)
  }

  res.render('genre_detail', {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  })
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: "Create Genre"})
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // validate and sanitize the name field
  body('name', 'Genre name must container at least 3 characters')
    .trim()
    .isLength({min: 3})
    .escape(),

  // process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // extract validation errors from request
    const errors = validationResult(req)

    // create genre object w/ escaped and trimmed data
    const genre = new Genre({ name: req.body.name })

    if (!errors.isEmpty()) {
      // errors. render form w/ sanitized values / error msgs
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array()
      })
      return;
    } else {
      // data from form is valid
      // check if duplicate
      const duplicate = await Genre.findOne({ name: req.body.name })
        .collation({locale:'en', strength: 2})
        .exec()
      if (duplicate) {
        // genre exists, redirect to detail page
        res.redirect(duplicate.url)
      } else {
        await genre.save()
        res.redirect(genre.url)
      }
    }
  })
]

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, allBooksWithGenre ]= await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, "title summary").exec()])

  if (genre === null) {
    res.redirect('/catalog/genres')
  }

  res.render("genre_delete", {
    title: "Delete Genre",
    genre: genre,
    genre_books: allBooksWithGenre
  })
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  // get details of genre and all their books
  const [genre, allBooksWithGenre ]= await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, "title summary").exec()
  ])

  if (allBooksWithGenre.length < 0){
    res.render('genre_delete', {
      title: "Delete Genre",
      genre: genre,
      genre_books: allBooksWithGenre
    })
    return
  } else {
    await Genre.findByIdAndDelete(req.body.genreid)
    res.redirect('/catalog/genres')
  }


});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec()

  if (genre === null) {
    const err = new Error("Genre not found")
    err.status = 404
    return next(err)
  }

  res.render("genre_form", {
    title: "Update Form",
    genre: genre
  })
});

// Handle Genre update on POST.
exports.genre_update_post = [
  // validate and sanitize the name field
  body('name', 'Genre name must container at least 3 characters')
    .trim()
    .isLength({min: 3})
    .escape(),

  // process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // extract validation errors from request
    const errors = validationResult(req)

    // create genre object w/ escaped and trimmed data
    const genre = new Genre({ 
      name: req.body.name,
      _id: req.params.id
    })

    if (!errors.isEmpty()) {
      // errors. render form w/ sanitized values / error msgs
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array()
      })
      return;
    } else {
      // data from form is valid
      // check if duplicate
      const duplicate = await Genre.findOne({ name: req.body.name })
        .collation({locale:'en', strength: 2})
        .exec()
      if (duplicate) {
        // genre exists, redirect to detail page
        res.redirect(duplicate.url)
      } else {
        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {})
        res.redirect(genre.url)
      }
    }
  })
]
