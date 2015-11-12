var express = require('express');
var http = require('http');
var city = require('./routes/city');
var market = require('./routes/market');
var meta = require('./routes/meta');
var mongoose = require('mongoose');
var cors = require('cors')

//DB connection:
mongoose.connect('mongodb://localhost/battledb');

var app = express();

// all environments
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// ROUTES HERE!
app.post('/:city/home', city.square);
app.post('/:city/build/:structure', market.build);
app.post('/:city/sell/:item', market.sell);

app.post('/reload/really', city.demolish);
app.get('/meta/:category', meta.lookup);

// Aaaaand here we go:
http.createServer(app).listen(app.get('port'), function(){
	console.log('MMO Express server listening on port ' + app.get('port'));
});
