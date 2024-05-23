const express = require('express')
const router = express.Router()
const Book = require('../models/book')
router.get('/', async (req, res) => {
    try
    {
        let books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()
        res.render('index', {books:books})
    }catch{
        res.render('index', {books:[]})
    }
})

module.exports = router