var express = require('express');
var app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const urlEncoded = bodyParser.urlencoded( {extended: false});
const http = require('http');
const https = require('https');
const fs = require('fs');
let http_server = http.createServer(app);
const io = require('socket.io')(http_server);
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(urlEncoded);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   // console.log(req.cookies);
    res.render("index.ejs");
});

app.get('/form_submit', (req, res) => {

    res.json({name: req.query.first_name});
});

app.post('/form_submit', (req, res) => {

    res.json({name: req.body.first_name});
});

http_server.listen(PORT, () => {
    console.log('server started on 8000');
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.username = "Anonymous";

    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {message: data.message, username: socket.username});
    });

    socket.on('change_username', (data) => {
       socket.username = data.username; 
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username: socket.username});
    });
});

/*
var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;

    //console.log(path.join(__dirname, 'public'));
    //console.log(__dirname + 'public');

    console.log("Server started on %s and port %s", host, port);
});*/
