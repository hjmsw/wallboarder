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



// app.post('/save', function (req,res) {
//   var file = __dirname + '/public/wb.json';
//
//   jsonfile.writeFile(file, req.body.wb, function (err) {
//     console.error(err);
//   });
//
//   res.end('yes');
// });

app.use(express.static('public'));
