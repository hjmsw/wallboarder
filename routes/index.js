var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var util = require('util');

var WallboardProvider = require('../providers/WallboardProvider').WallboardProvider;
WallboardProvider = new WallboardProvider('localhost', 27017);

router.get('/', function (req, res) {

  WallboardProvider.findOne(function(error, wallboard) {
    console.log(wallboard);
    if( error ) console.log(error)

    if (wallboard == null) {
      console.log("restoring from json");
      wb = require(__dirname + '/../public/wb.json');
      res.render('index', { elems:  wb.elems});
    } else {
        console.log("restoring from db");
        res.render('index', { elems:  wallboard.elems});
    }

  });

});

router.post('/', function(req,res) {
  console.log(req.body);

});

router.post('/save', function (req,res) {
  var file = __dirname + '/../public/wb.json';

  jsonfile.writeFile(file, req.body.wb, function (err) {
    console.error(err);
  });

  WallboardProvider.save(
    req.body.wb,
    function( error, docs) {
        console.log(error);
    });
});

module.exports = router;
