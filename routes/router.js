var express = require('express');
var router = express.Router();

var config = require('../config/config');

var WallboardProvider = require('../providers/WallboardProvider').WallboardProvider;
WallboardProvider = new WallboardProvider(config.db);

router.get('/', function(req, res) {
    res.redirect('/wb'); //Redirect to default wallboard
});

router.get('/wb', function(req, res) {

    WallboardProvider.listWallboards(function(error, list) {
        res.render('wbList', {
            wallboards: list
        });
    });

});

router.get('/wb/:url_slug', function (req, res) {

    // default = / for backwards compatibility
    var url_slug = (req.params.url_slug === 'default' ? '/' : req.params.url_slug);

    WallboardProvider.findOne(url_slug, {}, function (error, wallboard) {

        if (error) console.log(error);

        if (wallboard == null) {
            if (url_slug === '/') {
                wb = require(__dirname + '/../json/example_wb.json');
                res.render('index', {title: wb.title, elems: wb.elems, url_slug: url_slug});
            } else {
                wb = require(__dirname + '/../json/new.json');
                wb.url_slug = url_slug;
                res.render('index', {title: wb.title, elems: wb.elems, url_slug: url_slug});
            }

        } else {
            if(wallboard.url_slug === '/') wallboard.url_slug = 'default'; //backwards compatibility
            res.render('index', {title: wallboard.title, elems: wallboard.elems, url_slug: wallboard.url_slug, datetime: wallboard.created_at.getTime()});
        }

    });

});

router.get('/revisions/:url_slug', function(req, res) {

    var url_slug = (req.params.url_slug === 'default' ? '/' : req.params.url_slug);

    WallboardProvider.find(url_slug, function(err, wallboards) {

        var revisions = [];

        wallboards.forEach(function(i) {
            var epoch = new Date(i.created_at).getTime();
            if(i.url_slug === '/') i.url_slug = 'default';

            revisions.push({
                datetime: epoch,
                url: '/revisions/' + i.url_slug + '/' + epoch
            });
        });

        res.json(revisions);
    });
});

router.get('/revisions/:url_slug/:epoch', function(req, res) {
    var url_slug = (req.params.url_slug === 'default' ? '/' : req.params.url_slug);
    var epoch = parseInt(req.params.epoch);
    var datetime = new Date(epoch);

    WallboardProvider.findOneWithDate(url_slug, datetime, function (error, wallboard) {

        if (error) console.log(error);

        if (wallboard == null) {
            res.json("revision not found");
        } else {
            console.log("restoring from db");
            if(wallboard.url_slug === '/') wallboard.url_slug = 'default'; //backwards compatibility
            res.render('index', {
                title: 'REVISION: ' + wallboard.title,
                elems: wallboard.elems,
                revision: true,
                url_slug: wallboard.url_slug,
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
    var wb = req.body.wb;

    if (wb.url_slug === 'default') wb.url_slug = '/'; //backwards compatibility

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

router.get('/ping', function (req, res) {
  res.send('pong');
});

module.exports = router;
