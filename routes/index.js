var express = require('express');
var router = express.Router();

var WallboardProvider = require('../providers/WallboardProvider').WallboardProvider;
WallboardProvider = new WallboardProvider('localhost', 27017);

var config = require('../config/config');

router.get('/', function (req, res) {

    WallboardProvider.findOne("/", function (error, wallboard) {

        if (error) console.log(error);

        if (wallboard == null) {
            console.log("restoring from json");
            wb = require(__dirname + '/../json/example_wb.json');
            res.render('index', {title: wb.title, elems: wb.elems});
        } else {
            console.log("restoring from db");
            res.render('index', {title: wallboard.title, elems: wallboard.elems});
        }

    });

});

router.get('/revisions', function(req, res) {

    WallboardProvider.find('/', function(err, wallboards) {
        console.log(wallboards);

        var revisions = [];

        wallboards.forEach(function(i) {
            var epoch = new Date(i.created_at).getTime();

            revisions.push({
                datetime: epoch,
                url: '/revision/' + epoch
            });
        });

        res.json(revisions);
    });
});

router.get('/revision/:epoch', function(req, res) {
    var epoch = parseInt(req.params.epoch);
    var datetime = new Date(epoch);

    WallboardProvider.findOneWithDate("/", datetime, function (error, wallboard) {

        if (error) console.log(error);

        if (wallboard == null) {
            res.json("revision not found");
        } else {
            console.log("restoring from db");
            res.render('index', {
                title: 'REVISION: ' + wallboard.title,
                elems: wallboard.elems,
                revision: true,
                datetime: wallboard.created_at,
                epoch: epoch
            });
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
            if (error) {
                console.log(error);
                res.json({saved: false});
            } else {
                res.json({saved: true});
            }
        }
    );
});

module.exports = router;
