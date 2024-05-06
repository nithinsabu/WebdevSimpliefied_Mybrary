// if (process.env.NODE_ENV!=='production'){
//     require('dotenv').load() 
// }
const express = require("express")
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = express()

const expressLayouts = require("express-ejs-layouts")
const indexrouter = require('./routes/index')
const authourrouter = require('./routes/author')
const bodyParser = require('body-parser')

app.set("view engine", "ejs")
app.set('views', './views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:'10mb', extended:false}))
const mongoose = require("mongoose")
console.log(process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {console.log("Connected successfully.")})
    .catch(() => {console.log("Error in connection")})

// mongoose.
app.use('/', indexrouter)
app.use('/authors', authourrouter);
// app.get('/', (req, res) => {
//     res.render('index')
// })
app.listen(process.env.PORT || 3000)