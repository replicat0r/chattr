    function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]).replace(/\+/g,' ');
        }
    }
    
    return undefined;
}

    var name = getQueryVariable('name') || 'Anonymous'
    var room = getQueryVariable('room')
    
    $('.roomName').html(room)
    
    var socket = io();
    
    socket.on('connect',function(){
        console.log('connected to socket server');
        socket.emit('joinRoom',{
            name: name,
            room:room
        })

    });
    
    socket.on('message',function(message){
        var timeStamp = moment.utc(message.timeStamp).local().format(' h:mm:ss a')
        var $messages = $('.messages');
        $messages.append('<p><strong>' + message.name + " " + timeStamp +   ' </string></p>')
        $messages.append('<p>' + message.text + '<p>')
    });
    
    //handles the submitting of new message
    var $form = $('#messageform');
    $form.on('submit',function(e){
        e.preventDefault();
        var $message = $form.find('input[name=message]')
        socket.emit('message',{
            name: name,
            text: $message.val()
        })
        console.log($message.val())
        $message.val('');
    })