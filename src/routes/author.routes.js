const express = require("express")
const router = express.Router()
const Author = require('../models/author.model')
const Book = require('../models/books.model')


// GET Authors Page
router.get('/', async function (req, res, next) {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })

  } catch{
    res.redirect('/')
  }

});

// Get New Author
router.get('/new', function (req, res, next) {
  res.render('authors/new', { author: new Author() });
});

// Create New Author  
router.post('/', async function (req, res, next) {
  const author = new Author({
    name: req.body.name
  })
  try {
    await author.save();
    res.redirect('/authors')
  } catch{
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error Creating Author'
    })
  }
});

// Show Details Author
router.get('/:id', async function (req, res, next) {
  try {
    const author = await Author.findById(req.params.id)
    const booksByAuthor = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show',
      {
        author: author,
        booksByAuthor: booksByAuthor
      })
  } catch{
    res.redirect('/')
  }
})


// Get Update Author
router.get('/:id/edit', async function (req, res, next) {
  try {
    const author = await Author.findById(req.params.id)

    res.render('authors/edit', { author: author })
  } catch{
    res.redirect('/authors')
  }
})


// Update Author
router.put('/:id', async function (req, res, next) {
  let author
  try {

    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save();
    res.redirect(`/authors/${author.id}`)

  } catch{
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

// Delete Author
router.delete('/:id', async function (req, res, next) {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch{

    res.redirect(`/authors/${author.id}`)

  }
})

module.exports = router