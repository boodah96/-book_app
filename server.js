'use strict';
//.env
require('dotenv').config();
//define express 
const express= require('express');

const PORT=process.env.PORT ||4000
const server=express();


server.use(express.static('./public'));

server.use(express.urlencoded({extended:true}));

server.get('/',(req,res)=>{
    res.redirect('/index.html');
})


server.listen(PORT,()=>{
    console.log(`listen to PORT ${PORT}`)
})