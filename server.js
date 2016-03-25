var PORT = process.env.PORT || 3000
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'))

io.on('connection',function(socket){
    console.log('user connect via sockets')  
    socket.emit('message',{
        text: "welcome to the chat application"
    })
    
    socket.on('disconnect',function(){
        console.log('user has disconnected')
    })
    
    socket.on('update',function(){
        
    })
})

http.listen(PORT,function(){
    console.log(`Server started on ${PORT}`)
})