// if (process.env.NODE_ENV!=='production'){
//     require('dotenv').load() 
// }
const express = require("express")
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = express()

const expressLayouts = require("express-ejs-layouts")
const indexrouter = require('./routes/index')

app.set("view engine", "ejs")
app.set('views', './views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require("mongoose")
console.log(process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', error => console.log(error))
db.once('open', () => console.log("Connected"))

app.use('/', indexrouter)
// app.get('/', (req, res) => {
//     res.render('index')
// })
app.listen(process.env.PORT || 3000)