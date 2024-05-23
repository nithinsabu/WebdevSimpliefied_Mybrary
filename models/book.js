const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'
const bookschema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'author'
    }
})

bookschema.virtual('coverImagePath').get(function(){
    if (this.coverImageName!=null){
        // console.log(path.join('/', coverImageBasePath, this.coverImageName))
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
    return null
})
module.exports = mongoose.model('book', bookschema)
module.exports.coverImageBasePath = coverImageBasePath
