var PORT = process.env.PORT || 3000
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var moment = require('moment')

app.use(express.static(__dirname + '/public'))
var clientInfo = {}

function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];
    if (typeof info === 'undefined') {
        return;
    }

    Object.keys(clientInfo).forEach(function(socketId) {
        var userInfo = clientInfo[socketId]
        if (info.room === userInfo.room) {
            users.push(userInfo.room)
        }
    })
    socket.emit('message', {
        name: "System",
        text: `Current user: ${users.join(', ')}`
    })
}

io.on('connection', function(socket) {
    console.log('user connect via sockets')

    socket.on('disconnect', function() {
        var userData = clientInfo[socket.id]
        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: "System",
                text: `${userData.name} has left!`,
                timeStamp: moment.valueOf()
            })
            delete clientInfo[socket.id];
        }
    })

    socket.on('joinRoom', function(req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: `${req.name} has joined!`,
            timeStamp: moment().valueOf()
        })
        sendCurrentUsers(socket)
    })
    socket.emit('message', {
        text: "welcome to the chat application",
        timeStamp: moment.valueOf(),
        name: 'System'

    })

    socket.on('message', function(message) {

        message.timeStamp = moment.valueOf()
        io.to(clientInfo[socket.id].room).emit('message', message)



    })


})

http.listen(PORT, function() {
    console.log(`Server started on ${PORT}`)
})