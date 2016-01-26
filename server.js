var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var server = require('http').Server(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

server.listen(8081);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.post('/save', function (req,res) {
  console.log(req.body.wb);
  res.end('yes');
});




app.use(express.static('public'));

