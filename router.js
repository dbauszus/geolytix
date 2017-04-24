var express = require('express');
var router = express.Router();
var queries = require('./queries');
var jsr = require('jsrender');
var fs = require('fs');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/mobile', function (req, res) {
    res.render('mobile');
});

router.get('/map_mobile', function (req, res) {
    var dataset = req.originalUrl.substring(req.originalUrl.indexOf('?') + 1);
    var tmpl = jsr.templates('./views/gd_map_m.html');
    if (fs.existsSync('./public/tmpl/gd_' + dataset + '.html')){
        var html = tmpl.render({
            gd_tmpl: './public/tmpl/gd_' + dataset + '.html'
        });
        res.send(html);
    } else {
        res.send(jsr.renderFile('./views/error.html'));
    }
});

router.get('/map', function (req, res) {
    var dataset = req.originalUrl.substring(req.originalUrl.indexOf('?') + 1);
    var tmpl = jsr.templates('./views/gd_map.html');
    if (fs.existsSync('./public/tmpl/gd_' + dataset + '.html')){
        var html = tmpl.render({
            gd_tmpl: './public/tmpl/gd_' + dataset + '.html'
        });
        res.send(html);
    } else {
        res.send(jsr.renderFile('./views/error.html'));
    }
});

router.get('/grid_query', queries.grid_query);

module.exports = router;