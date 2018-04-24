// Module
var express = require('express'); //Server
var fs = require('fs'); //Brauchen das Filesystem
var bp = require('body-parser') //Mit dem BodyParser kann man Daten zugänglich machen

var app = express();
app.listen(5000, function(){ //müssen den Port definieren
  console.log( 'Server gestartet, Port 5000')//callback funktion wird ausgeführt wenn der Server erfolgreich gestartet ist
});

//Macht alle Daten, die der Server bekommt (POST-Daten) lesbar (JS OBjekt)
// Funktioniert aber nicht wenn wir JSON Daten schicken => app.use(bp.json() );
app.use(bp.urlencoded({extended:true}));

  var alleOrte; //globale Variable
  fs.readFile('orte.json', function(err, data){
    alleOrte = JSON.parse(data);//wandle Inhalt in Objekt um

  });

//Erster Request: Speicher den Ort
app.post( '/orte', function(request, response){
  var neuerOrt = {
    name: request.body.name,
//wollen lat als Zahl verwenden, denn normalerweise werden POST_Daten als STRING geschickt
    lat: request.body.lat *1,
    lng: request.body.lng * 1,
  }

if(neuerOrt.name && neuerOrt.lat && neuerOrt.lng){
  //daten speichern
  alleOrte.orte.push(neuerOrt);
  fs.writeFile('orte.json', JSON.stringify(alleOrte), function(){
    response.writeHead(200, {'Content-Type':'application/json'});
    response.end(JSON.stringify({result:true}));
  });
  } else {
  //Error
  response.status(500).end();
  }

});// Speicher Orte REQUEST

app.post( '/zeigeorte', function(request, response){
  response.writeHead(200, {'Content-Type':'application/json'});
  response.end(JSON.stringify(alleOrte));

});

//Um Corss-origin probleme zu umgehen wird die html datei auch von der JS Datei aufgerufen
app.get( '/', function(request, response){
  response.sendFile(__dirname+'/d12-orterequest.html');//doppelter unterstrich
});
// um statische Files available zu machen
app.use(express.static('static'));
//sieh nach ob angefragte Datei im Ordner static liegt
