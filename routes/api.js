var express = require('express');
var router = express.Router();

var config = require('../config/config');

var WallboardProvider = require('../providers/WallboardProvider').WallboardProvider;
WallboardProvider = new WallboardProvider(config.db.host);


router.get('/wb', function(req, res) {
    WallboardProvider.listWallboards(function(error, list) {
        if (error) res.status(404).json({success: false, errorCode: 404, error: error});
        else res.json(list);
    });
});

router.get('/wb/:url_slug', function (req, res) {

    var url_slug = req.params.url_slug;

    WallboardProvider.findOne(url_slug, {}, function (error, wallboard) {
        if (error) res.status(404).json({success: false, errorCode: 404, error: error});
        else res.json(wallboard);

    });

});

router.get('/revisions/:url_slug', function(req, res) {

    var url_slug = req.params.url_slug;

    WallboardProvider.find(url_slug, function(err, wallboards) {

        var revisions = [];

        wallboards.forEach(function(i) {
            var epoch = new Date(i.created_at).getTime();

            revisions.push({
                datetime: epoch,
                url: '/revisions/' + i.url_slug + '/' + epoch
            });
        });

        res.json(revisions);
    });
});

router.get('/revisions/:url_slug/:epoch', function(req, res) {
    var url_slug = req.params.url_slug;
    var epoch = parseInt(req.params.epoch);
    var datetime = new Date(epoch);

    WallboardProvider.findOneWithDate(url_slug, datetime, function (error, wallboard) {

        if (error) console.log(error);

        if (wallboard == null) {
            res.status(404).json({success: false, errorCode: 404});
        } else {
            console.log("restoring from db");
            res.json(wallboard)
        }
    });
});


router.post('/save', function (req, res) {
    var wb = req.body.wb;
    
    WallboardProvider.save(
        wb,
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

router.get('/convert-legacy-routes', function(req, res) {
    WallboardProvider.convertLegacyRoutes(function(error, result) {
        if (error) res.status(500).json({success: false, errorCode: 500, error: error});
        else res.json({success: false, result: result});
    });
});


module.exports = router;
