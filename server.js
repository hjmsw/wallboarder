var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./routes/router');
var api = require('./routes/api');

var config = require('./config/config');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);
app.use('/api/v1', api);

server.listen(config.app.port, config.app.host);

app.use(express.static('public'));
app.use('/components', express.static('bower_components'));


var editing = false;
var c_client = "";

io.on('connection', function(socket) {
    console.log('client connected');

    socket.on('wb_nsp', function (data) {
        socket.emit('acc', {wb_nsp: data.wb_nsp});
        var nsp = io.of('/' + data.wb_nsp);
        nsp.on('connection', function (socket) {
            socket.once('wb-client-edit', function (data) {
                if (!editing) {
                    editing = true;
                    c_client = data;

                    nsp.emit('wb-server-io-event', {type: 'edit', client: c_client});
                }
            });

            socket.once('wb-client-save', function (data) {
                if (c_client === data) {

                    nsp.emit('wb-server-io-event', {type: 'save', client: c_client});

                    editing = false;
                    c_client = "";
                }
            });

            socket.once('wb-client-get-edit-status', function () {
                nsp.emit('wb-server-io-status', editing);
            });

            socket.once("disconnect", function (data) {
                if (editing && c_client === socket.conn.id) {
                    editing = false;
                    c_client = "";

                    socket = null;

                    nsp.emit('wb-server-io-event', {type: 'editor-quit', client: c_client});
                }
            });
        });
    });
});

