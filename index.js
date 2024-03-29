const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ip = require('ip');
const moment = require('moment');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


function sortData(data, sortBy) {
    return [...data].sort((a, b) => {
        const valueA = isNaN(a.answers[sortBy]) ? a.answers[sortBy] : parseFloat(a.answers[sortBy]);
        const valueB = isNaN(b.answers[sortBy]) ? b.answers[sortBy] : parseFloat(b.answers[sortBy]);

        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
    });
}

app.post('/submit', (req, res) => {
    const date = moment().format('DD-M-YYYY');
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
            console.log("Data saved!.");
            res.redirect("/results");
        });
    });
});


app.get('/results', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Chyba při čtení souboru data.json:', err);
            return res.status(500).send('Chyba na serveru');
        }

        let jsonData = JSON.parse(data);

        if (req.query.sort) {
            const sortBy = req.query.sort;
            jsonData = sortData(jsonData, sortBy);
        }

        res.render('results', { data: jsonData });
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`port : ${PORT}`);
});
