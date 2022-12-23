const express = require('express');
const app = express();
const ShortUrl = require('./models/shortUrl')
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false}))

mongoose.connect('mongodb://127.0.0.1/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls});
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 3000);

