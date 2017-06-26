// import middleware
var app = require('./app.js');
// create server
var server = require('http').createServer(app);
// attach socket.io to http server
var io = require('socket.io')(server);
var socketHandler = require('./socket')(io);

server.listen(3000, function () {
  console.log('server running on port 3000');
});


