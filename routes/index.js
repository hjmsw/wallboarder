var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var util = require('util');

var WallboardProvider = require('../providers/WallboardProvider').WallboardProvider;
WallboardProvider = new WallboardProvider('localhost', 27017);

router.get('/', function (req, res) {

    WallboardProvider.findOne(function (error, wallboard) {
        console.log(wallboard);
        if (error) console.log(error)

        if (wallboard == null) {
            console.log("restoring from json");
            wb = require(__dirname + '/../json/wb.json');
            res.render('index', {elems: wb.elems});
        } else {
            console.log("restoring from db");
            res.render('index', {elems: wallboard.elems});
        }

    });

});

router.post('/', function (req, res) {
    res.json(req.body);

});

router.post('/save', function (req, res) {
    WallboardProvider.save(
        req.body.wb,
        function (error, docs) {
            console.log(error);
        });
});

module.exports = router;
