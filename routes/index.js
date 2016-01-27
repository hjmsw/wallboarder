var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var util = require('util');

router.get('/', function (req, res) {

  var elems = require(__dirname + '/../public/wb.json');
  console.log(elems);
  res.render('index', { wb: elems });
});

module.exports = router;
