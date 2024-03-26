const http = require('http')
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const PORT = 2000;
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
        res.render('index');
});




app.get('/submit', )







app.listen(PORT, () => {
    console.log(`PORT ${PORT}`);
    });