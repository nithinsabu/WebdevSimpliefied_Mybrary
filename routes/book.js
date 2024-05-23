const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

const fs = require('fs')
const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest:uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title!=null && req.query.title!==""){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore!=null && req.query.publishedBefore!==""){
       query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter!=null && req.query.publishedAfter!==""){
        query = query.gte('publishDate', req.query.publishedAfter)
     }
    try{
        const books = await query.exec();
        res.render('books', {books:books, searchOptions: req.query})     
    }
    catch{
        res.redirect('/')
    }
})

router.get('/new', async (req, res) => {
    try {
        const book = new Book()
        // res.render('books/new',{book: book, authors: authors})
        renderNewPage(res, book, false)
    }catch(err){
        // console.log(err)
        res.redirect('/books')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', {book: book})}
    catch{
        res.redirect('/')
    }
})
router.get('/:id/edit', async (req, res) =>{
    try{
        const book = await Book.findById(req.params.id)
        renderFormPage(res, book, 'edit')
    }catch{
        res.redirect('/books')
    }
})

router.put('/:id', async (req, res) =>{
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover!=null && req.body.cover!==""){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }catch(e){
        // console.log(e)
        if (book!=null)    
            {renderFormPage(res, book, 'edit', true)}
        else{
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let book
    try{
        book = await Book.findById(req.params.id)
        await book.deleteOne()
        res.redirect('/books')
    }catch{
        if (book!=null){
            res.render('/books/show', {book: book, error_message: 'Could not remove Book'}, )
        }else{
            res.redirect('/')
        }
    }
})

router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file!=null? req.file.filename: null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    try{
        const newBook = await book.save()
        res.redirect(`/books/${newBook.id}`)
    }catch{
        if (book.coverImageName!=null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

const removeBookCover = (coverName) => {
    fs.unlink(path.join(uploadPath, coverName), (err) => {if (err) console.log(err)})
}

const renderFormPage = async (res, book, form ,err=false) =>{
    try {
        const authors = await Author.find({})
        const params = {book: book, authors: authors}
        if (err) params.error_message = "Error Creating book"
        if (err && form==='edit') params.error_message = "Error Updating book"
        res.render(`books/${form}`, params)
    }
    catch{
        res.redirect("/books")
    }
}
const renderNewPage = async (res, book, err=false) =>{
    renderFormPage(res, book, 'new')
}
module.exports = router