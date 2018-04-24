// Module
var express = require('express');

var socket = require('socket.io');

var app = express();
var server = app.listen(26893, function(){
  console.log('Wifi Secret Chat.');
  });
app.use(express.static('static'));
app.get('/', function(request, response){
  response.sendFile(__dirname+'/d13-chat.html');

});

var io = socket(server);
io.on('connection', function(socket){
  //socket is Verbindung zwischen Server und einem Client
  console.log('Neuer Benutzer online.');
  var user;
//der Server 'hört' auf den neuen User
  socket.on('neueruser', function(name){
    user = name
    //Wenn es einen neuen user gibt, iniziert die Serverseite
    io.emit('servershout', new Date().toUTCString()+'<br><em><b>'+name+'</b> ist online.</em>')
  });

  socket.on('disconnect', function(){
    io.emit('servershout', new Date().toUTCString()+'<br><em><b>'+user+'</b> ist offline.</em>')
  });

  socket.on('clientshout', function(msg){
    io.emit('servershout', new Date().toUTCString()+'<br><b>'+user+'</b>: '+msg);
  });

});
