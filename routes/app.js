var express = require('express');
var router = express.Router();
var config = require('../config/config');
var request = require('request');
var appUrl = config.app.host + (config.app.port === 80 ? '' : ':' + config.app.port);

router.get('/', function(req, res) {
    res.redirect('/wb'); //Redirect to wallboard list
});

router.get('/wb', function(req, res) {
    request('http://' + appUrl + '/api/v1/wb', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.render('wbList', {
                wallboards: JSON.parse(body)
            });
        }
    })

});

router.get('/wb/:url_slug', function (req, res) {

    var url_slug = req.params.url_slug;

    request('http://' + appUrl + '/api/v1/wb/' + url_slug, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var wallboard = JSON.parse(body);
            console.log(wallboard);
            if (wallboard == null) {
                if (url_slug === 'default') {
                    wb = require(__dirname + '/../json/example_wb.json');
                    res.render('index', {title: wb.title, elems: wb.elems, url_slug: url_slug});
                } else {
                    wb = require(__dirname + '/../json/new.json');
                    wb.url_slug = url_slug;
                    res.render('index', {title: wb.title, elems: wb.elems, url_slug: url_slug});
                }

            } else {
                var datetime = new Date(wallboard.created_at);
                res.render('index', {title: wallboard.title, elems: wallboard.elems, url_slug: wallboard.url_slug, datetime: datetime.getTime()});
            }
        }
    });

});

router.get('/revisions/:url_slug/:epoch', function(req, res) {
    var epoch = parseInt(req.params.epoch);
    var url_slug = req.params.url_slug;

    request('http://' + appUrl + '/api/v1/revisions/' + url_slug + '/' + epoch, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var wallboard = JSON.parse(body);

            res.render('index', {
                title: 'REVISION: ' + wallboard.title,
                elems: wallboard.elems,
                revision: true,
                url_slug: wallboard.url_slug,
                datetime: wallboard.created_at,
                epoch: epoch
            });
        } else if (response.statusCode == 404) {
            res.render('404');
        }
    });

});

router.post('/wb/:url_slug', function (req, res) {
    res.json(req.body);
});

router.get('/ping', function (req, res) {
    res.send('pong');
});


module.exports = router;
