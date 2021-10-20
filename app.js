var path = require('path');

const config = require("./config.json");
const crypto = require("crypto");

var express = require('express');
var session = require('express-session');
var favicon = require('express-favicon');
var app = express();

var hc = require('./js/htmlconstruction');
var db = require('./js/database');
var dt = require('./js/datetime');

app.use(session({   secret: config.sessionSecret,
                    resave: false,
                    saveUninitialized: false}));

app.use('/css', express.static(path.join(__dirname,'res','css')));
app.use('/dtsel', express.static(path.join(__dirname,'dtsel')));
app.use(favicon(path.join(__dirname, 'res', 'favicon.ico')));

const psDec = Array.prototype.map.call(new Uint8Array(crypto.createHash("sha256").update(config.adminPassword).digest()), x=>(('00'+x.toString(16)).slice(-2))).join('');

app.get('/', async function (req, res) {
    if(req.session.loginSession) {
        var data = await hc.constructHomePage();
        res.send(data);
    } else {
        res.sendFile(path.join(__dirname, 'res', 'html', 'login.html'));
    }
});

app.get('/create', function(req, res) {
    if(req.session.loginSession) {
        console.log('Creating entry:', req.query.title);
        var dtdata = dt.parseDateTime(req.query.date);
        db.createEntry(req.query.title, req.query.desc, dtdata);
    }
    res.redirect('/');
});

app.get('/delete', function(req, res) {
    if(req.session.loginSession) {
        console.log('Deleting entry:', req.query.postindex);
        db.deleteEntry(req.query.postindex);
    }
    res.redirect('/');
});

app.get('/login', function(req, res) {
    console.log('Login attempt happening...', req.query.hpw);
    if(req.query.hpw == psDec) {
        req.session.loginSession=true;
    }
    res.redirect('/');
});

app.get('/makeperp', function(req, res) {
    if(req.session.loginSession) {
        console.log('Making entry', req.query.perpind, 'perpetual.');
        db.makePerp(req.query.perpind);
    }
    res.redirect('/');
})

app.listen(3000, function () {
    console.log('app.js listening on port 3000.');
});