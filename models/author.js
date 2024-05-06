const mongoose = require("mongoose")

const authorSchema = mongoose.Schema({
    name:{
        required: true,
        type: String
    }
})

module.exports = mongoose.model('author', authorSchema)