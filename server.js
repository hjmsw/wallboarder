var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./routes/router');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

server.listen(8081);

app.use(express.static('public'));
app.use('/components', express.static('bower_components'));


var editing = false;
var c_client = "";

io.on('connection', function(socket) {
    console.log('client connected');

    socket.on('wb-client-edit', function (data) {
        if (!editing) {
            editing = true;
            c_client = data;

            io.emit('wb-server-io-event', {type: 'edit', client: c_client});
        }
    });

    socket.on('wb-client-save', function (data) {
        if (c_client === data) {

            io.emit('wb-server-io-event', {type: 'save', client: c_client});

            editing = false;
            c_client = "";
        }
    });

    socket.on('wb-client-get-edit-status', function() {
        socket.emit('wb-server-io-status', editing);
    });

    socket.on("disconnect", function(data) {
        if (editing && c_client === socket.conn.id) {
            editing = false;
            c_client = "";

            io.emit('wb-server-io-event', {type: 'editor-quit', client: c_client});
        }
    });
});

