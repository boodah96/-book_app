'use strict';
//.env
require('dotenv').config();
//define express 
const express= require('express');

const pg=require("pg")

const superagent=require('superagent')
const PORT=process.env.PORT ||4000
const server=express();
let client='';
if (PORT==3000 ||PORT==3050){
    client = new pg.Client(process.env.DATABASE_URL); 
}else{
   client = new pg.Client({ connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } });
}


server.use(express.static('./public'));

server.use(express.urlencoded({extended:true}));

server.set('view engine','ejs');
//home rout
server.get('/',handelHome)
//to do new search
server.get('/searches/new',handleSearch)
//show result
server.post('/searches',SearchResult)
// details for single book
server.get('/books/:id',bookDetails)


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
.catch((error) => {
    errorHandler(error, req, res);
})
}

function errorHandler(error, req, res) {
    let errObj = {
        status: 500,
        error: error
    }
    res.render('pages/error', { error: errObj });
}

function handelHome(req,res){
    let SQL=`SELECT * FROM books;`
client.query(SQL)
.then(result=>{
         res.render('pages/index',{allBooks:result.rows});
})
}

function bookDetails(req,res){
let bookId=[req.params.id];
let SQL=`SELECT * FROM books WHERE id=$1`
client.query(SQL,bookId)
.then(result=>{
res.render('pages/books/show',{allBooks: result.rows})
})
.catch((error) => {
    errorHandler(error, req, res);
});
}
//constructors
function Book(data) {
    this.img = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    this.title = (data.volumeInfo.title) ? data.volumeInfo.title : `Title unavilable`;
    this.authors = (Array.isArray(data.volumeInfo.authors)) ? data.volumeInfo.authors.join(', ') : `Author unavilable`;
    this.description = (data.volumeInfo.description) ? data.volumeInfo.description : `description unavilable`;
    this.isbn=(data.volumeInfo.industryIdentifiers) ? data.volumeInfo.industryIdentifiers[0].identifier : `ISBN unavilable`;
    this.bookshelf=(data.volumeInfo.categories) ? data.volumeInfo.categories[0]: `This book not on shelf`;
}

client.connect()
.then(
    server.listen(PORT,()=>{
        console.log(`listen to PORT: ${PORT}`)}
    ) )

