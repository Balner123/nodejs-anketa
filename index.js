const http = require('http')
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const PORT = 3000;
const app = express();
const ip = require('ip');
const moment = require('moment');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
        res.render('index');
});


app.post('/submit',(req,res)=>{

        console.log(req.body)
        let date = moment().format('DD-M-YYYY');

        const odpoved = {
                ip: ip.address(),
                timestamp: date,
                answers: req.body,
              };

              fs.readFile("data.json", (err, data) => {
                if (err) throw err;
                let json = JSON.parse(data);
                json.push(odpoved);
            
                fs.writeFile("data.json", JSON.stringify(json, null, 2), (err) => {
                  if (err) throw err;
                  console.log("data saved!.");
                  res.redirect("/results");
                });
              });
            
} );


app.get('/results', (req, res) => {
        fs.readFile('data.json', (err, data) => {
            if (err) {
                console.error('Chyba při čtení souboru data.json:', err);
                return res.status(500).send('Chyba na serveru');
            }else{
                const jsonData = JSON.parse(data);
                res.render('results', { data: jsonData });
            }
               
        
        });
    });







app.listen(PORT, () => {
    console.log(`PORT ${PORT}`);
    });