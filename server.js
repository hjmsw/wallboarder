var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);

var routes = require('./routes/index');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

server.listen(8081);

app.use(express.static('public'));
app.use('/components', express.static('bower_components'));
