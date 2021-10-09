var path = require('path');

var express = require('express');
var app = express();

var hc = require('./js/htmlconstruction');
var db = require('./js/database');
var dt = require('./js/datetime');

app.use('/css', express.static(path.join(__dirname,'res','css')));
app.use('/dtsel', express.static(path.join(__dirname,'dtsel')));

app.get('/', async function (req, res) {
    var data = await hc.constructHomePage();
    res.send(data);
});

app.get('/create', function(req, res) {
    console.log('Creating entry:', req.query.title);
    var dtdata = dt.parseDateTime(req.query.date);
    db.createEntry(req.query.title, req.query.desc, dtdata);
    res.redirect('/');
});

app.get('/delete', function(req, res) {
    console.log('Deleting entry:', req.query.postindex);
    db.deleteEntry(req.query.postindex);
    res.redirect('/');
})

app.listen(3000, function () {
    console.log('app.js listening on port 3000.');
});