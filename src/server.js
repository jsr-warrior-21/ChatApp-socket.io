require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.use('/',express.static(__dirname+'/public'));



app.listen(PORT,()=>{
    console.log(`Server Started On The PORT : ${PORT}`);
});