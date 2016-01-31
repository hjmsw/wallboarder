var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var util = require('util');

router.get('/', function (req, res) {

  var elems = require(__dirname + '/../public/wb.json');

  res.render('index', { elems: elems });
});

router.post('/save', function (req,res) {
  var file = __dirname + '/../public/wb.json';

  jsonfile.writeFile(file, req.body.wb, function (err) {
    console.error(err);
  });

  res.end('yes');
});

module.exports = router;
