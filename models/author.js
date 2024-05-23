const mongoose = require("mongoose")
const Book = require("./book")
const authorSchema = mongoose.Schema({
    name:{
        required: true,
        type: String
    }
})

// authorSchema.pre('deleteOne', async function(next) {
//     try {
//         console.log(this.id)
//         console.log(this.name)
//         const books = await Book.find({author: this.id})
//         console.log(books)
//         if (books.length>0){
//             next(new Error("The author still has books"))
//         }else{
//             next()
//         }
//     }catch(err){
//         next(err)
//     }
//     })
authorSchema.pre('deleteOne', async function(next){
    try{
        const books = await Book.find({author: this.getQuery()._id})
        if (books.length>0){
            next(new Error('This author has books still'))
        }else{
            next()
        }
    }
    catch{
        next(err)
    }    
})
module.exports = mongoose.model('author', authorSchema)