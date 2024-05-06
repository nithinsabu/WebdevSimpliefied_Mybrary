const express = require('express')
const router = express.Router()
const Author = require('../models/author')
router.get('/', async (req, res) => {
    let searchoptions = {}
     if (req.query.name!=null && req.query.name!==''){
        searchoptions.name = new RegExp(req.query.name, 'i')
        console.log(searchoptions.name)
    }
    try{
        const authors = await Author.find(searchoptions)
        // console.log(authors)
        res.render('authors/index', {authors: authors})
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
        res.redirect('/authors')
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
module.exports = router