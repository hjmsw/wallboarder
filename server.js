var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./routes/app');
var api = require('./routes/api');

var config = require('./config/config');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (config.ipfilter.enabled) {
    ipfilter = require('express-ipfilter');
    app.use(ipfilter(config.ipfilter.whitelist, {mode: 'allow'}));
}

app.use('/', routes);
app.use('/api/v1', api);

server.listen(config.app.port, config.app.host);

app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));
app.use('/components', express.static('node_modules'));

var editing = {};
var c_client = {};

io.on('connection', function(socket) {

    socket.on('api-event', function(data) {
        socket.broadcast.emit('wb-event', data);
    });

    socket.on('api-upsert', function(data) {
       socket.broadcast.emit('wb-server-io-external-upsert', data);
    });

    socket.on('wb_nsp', function (data) {
        var nspString =  data.wb_nsp;
        socket.emit('acc', {wb_nsp: nspString});

        var nsp = io.of('/' + nspString);
        nsp.once('connection', function (socket) {
            if (typeof editing[nspString] === 'undefined') editing[nspString] = false;
            if (typeof c_client[nspString] === 'undefined') c_client[nspString] = "";

            socket.once('wb-client-edit', function (data) {

                if (!editing[nspString]) {
                    editing[nspString] = true;
                    c_client[nspString] = data;

                    nsp.emit('wb-server-io-event', {type: 'edit', client: c_client[nspString]});
                }
            });

            socket.once('wb-client-save', function (data) {
                if (c_client[nspString] === data) {

                    nsp.emit('wb-server-io-event', {type: 'save', client: c_client[nspString]});
                    editing[nspString] = false;
                    c_client[nspString] = "";
                }
            });

            socket.once('wb-client-get-edit-status', function () {
                nsp.emit('wb-server-io-status', {status: editing[nspString], client: c_client[nspString]});
            });

            socket.once("disconnect", function (data) {
                if (editing[nspString] && c_client[nspString] === socket.conn.id) {
                    socket = null;
                    nsp.emit('wb-server-io-event', {type: 'editor-quit', client: c_client[nspString]});
                    editing[nspString] = false;
                    c_client[nspString] = "";
                }
            });
        });
    });
});

module.exports = server;