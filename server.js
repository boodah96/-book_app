'use strict';
//.env
require('dotenv').config();
//define express 
const express= require('express');
const superagent=require('superagent')
const PORT=process.env.PORT ||4000
const server=express();


server.use(express.static('./public'));

server.use(express.urlencoded({extended:true}));

server.set('view engine','ejs');

server.get('/',(req,res)=>{
    res.render('pages/index');
})

server.get('/searches/new',handleSearch)
server.post('/searches',SearchResult)


//functions
function handleSearch(req,res){
    res.render('pages/searches/new')
}

function SearchResult(req,res){
let search=req.body.search;
let searchBy=req.body.searchBy;
let url = `https://www.googleapis.com/books/v1/volumes?q=+${searchBy}:${search}`;
superagent.get(url)
.then(result=>{
    let books =result.body.items.map(data=>{
        return new Book(data);
    })
    res.render('pages/searches/show',{ allBooks: books});
})
.catch(() => {
    errorHandler(`Sorry, we have an error`, req, res);
})
}

function errorHandler(error, req, res) {
    let errObj = {
        status: 500,
        error: error
    }
    res.render('pages/error', { error: errObj });
}
//constructors
function Book(data) {
    this.title = (data.volumeInfo.title) ? data.volumeInfo.title : `Title unavilable`;
    this.authors = (Array.isArray(data.volumeInfo.authors)) ? data.volumeInfo.authors.join(', ') : `Author unavilable`;
    this.description = (data.volumeInfo.description) ? data.volumeInfo.description : `description unavilable`;
    this.img = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
}

server.listen(PORT,()=>{
    console.log(`listen to PORT: ${PORT}`)
})