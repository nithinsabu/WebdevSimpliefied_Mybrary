const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
router.get('/', async (req, res) => {
    let searchoptions = {}
     if (req.query.name!=null && req.query.name!==''){
        searchoptions.name = new RegExp(req.query.name, 'i')
        console.log(searchoptions.name)
    }
    try{
        const authors = await Author.find(searchoptions)
        // console.log(authors)
        res.render('authors/index', {authors: authors, name:req.query.name})
    }catch{
        console.log("Error in finding author")
        res.redirect('/')
    }
})
router.get('/new', (req, res) => {

    res.render('authors/new', {author: new Author()})
}) 

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
    }catch{
        res.render('authors/new', {
            author: author,
            error_message: 'Error creating Author'
        })
    }
    // author.save((err, newAuthor) => {
    //     if (err){
    //         res.render('/authors/new', {
    //             author: author,
    //             errorMessage: 'Error creating author'
    //         })
    //     }else{
    //         res.redirect('/authors/index')
    //     }
    // })
})

router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author:author.id}).limit(6).exec()
        res.render('authors/show', {author:author, booksByAuthor:books})
    }catch(e){
        console.log(e)
        res.redirect('/authors')
    }
})

router.get('/:id/edit', async (req, res) => {
    // res.send('Edit Author ' + req.params.id)
    try{    
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    }catch{
        res.redirect('/authors')
    }
}
)

router.put('/:id', async (req, res) => {
    // res.send('Update Author '+ req.params.id)
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }catch{
        if (author==null){
            res.redirect('/')
        }else{
            res.render('authors/edit', {
                author: author,
                error_message: "Error updating author"
            })
        }
    }

})

router.delete('/:id', async (req, res) => {
    let author
    // console.log(req.params.id)
    // try {author = await Author.findById(req.params.id)}
    // catch(err){console.log(err)}
    // res.send('Delete Author ' + req.params.id)
    try{
        author = await Author.findById(req.params.id)
        console.log(author)
        await author.deleteOne()
        // await Author.findByIdAndRemove(req.params.id)
        res.redirect(`/authors`)
    }catch(err){
        if (author==null){
            res.redirect('/')
        }else{
            // console.log(err)
            console.log(author.id)
            res.redirect(`/authors/${author.id}`)
        }
    }
    // res.redirect(`/authors/${author.id}`)
})
module.exports = router