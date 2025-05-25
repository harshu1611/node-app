const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const router = require('./routes.js');
const app= express();
app.use(bodyParser.json());


app.get('/',(req,res)=>{  
    res.send('Welcome to AWS API ');
});

app.use(router)

app.listen(3002,()=>{
    console.log('Server is running on port 3002');
})

