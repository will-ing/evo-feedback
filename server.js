'use strict';

require('dotenv').config();
const cors = require('cors');

const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const pg = require('pg');
const methodOverride = require('method-override');
const app = express();

const client = new pg.Client(process.env.DATABASE_URL);

app.use(cors());

//brings in EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));

app.get('/', handleIndex);
app.get('/gif', handleGif);



function handleGif(req, res) {
    let url = `https://api.giphy.com/v1/gifs/search`;

    let queryStringParams = {
        api_key: process.env.GIPHY_KEY,
        q: req.query.gifSearch,
        limit: 9,
    };
    // console.log(queryStringParams);
    superagent.get(url)
        .query(queryStringParams)
        .then(results => {
            // console.log(results.body.data.original);
            let selection = results.body.data.map(gif => new Gifs(gif));
            res.status(200).render('pages/partials/gifs', { meme: selection });
        });
}

function Gifs(data) {
    this.name = data.name;
    this.template_id = data.id;
    this.url = data.images.original.url;
    this.text0 = data.text0;
    this.text1 = data.text1;
    this.font = data.arial;
    this.box_count = data.box_count;
}



function handleIndex(req, res) {
    res.status(200).render('pages/index');
}



function startServer() {
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
}

client.connect()
    .then(() => {
        startServer(PORT);
    }).catch(err => console.error(err));


