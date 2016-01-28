var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var util = require('util');

router.get('/', function (req, res) {

  var elems = require(__dirname + '/../public/wb.json');

  res.render('index', { elems: elems });
});

module.exports = router;
