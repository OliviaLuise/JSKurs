console.log('server-linien.js');

// Benötigte Module
var express = require('express');
var bp = require('body-parser');
var fs = require('fs');
var request = require('request');
var csv = require('csv');

//Lade Ubahnen von JSON-File
var ubahnen;
fs.readFile('ubahnen.json', function(err,data){
  try {
    ubahnen = JSON.parse(data);
  } catch(e){
    ubahnen = {};
  }
});
//

//Startet express Applikation bzw Server
var app = express();

var server = app.listen(5001, function(){
  console.log('Server läuft auf Port 5001');
});

//Standardfunktionen für statische Files und POST Requests
app.use(bp.urlencoded({extended:true}));
app.use(express.static('static'));

//HTML für UI
app.get( '/', function(request, response){
  response.sendFile(__dirname+'/d14-linien.html');//doppelter unterstrich
});

//POST REQUEST
app.post('/getWLData', function(req, res) {
  //Lade CVS
  console.log('Daten von WL werden geladen...')
  request.get('https://data.wien.gv.at/csv/wienerlinien-ogd-linien.csv',
   function(err, response, body){
     if(!err && res.statusCode == 200){
       //console.log(body);
       csv.parse(body, {delimiter:';'}, function(error, data){
         //console.log(data);
         //var ubahnen = {};
         //bei 1 starten, weil 0 sind Spaltenbezeichnungen
         for(let i = 1; i < data.length; i++){
           if ( data[i][4] != 'ptMetro') continue;
           ubahnen[data[i][1]] = data[i][0];
         }
         console.log(ubahnen);
         fs.writeFile('ubahnen.json', JSON.stringify(ubahnen),
          function(){
            //Antwort zum Client
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end('{"result":"success"}');
          }); //fs writeFile

       }); //csv parse
     } else {
       res.code(404).end(); //Error keine Daten von WL
     }
   });//request auf csv
});//post request auf Liniendaten

app.post('/getBSData', function(req, res){
  console.log('Bahnsteige werden geladen...');
  request.get('https://data.wien.gv.at/csv/wienerlinien-ogd-steige.csv',
    function(err, response, body){
      if(!err && res.statusCode == 200){
        console.log(body);
        csv.parse(body, {delimiter:';'}, function(error, data){
          console.log(data);
          /*for(let i = 1; i < data.length; i++){
            if ( data[i][4] != 'ptMetro') continue;
            ubahnen[data[i][1]] = data[i][0];
          }
          console.log(ubahnen);
          fs.writeFile('ubahnen.json', JSON.stringify(ubahnen),
           function(){
             //Antwort zum Client
             res.writeHead(200, {'Content-Type':'application/json'});
             res.end('{"result":"success"}');
           }); //fs writeFile

        }); //csv parse
      } else {
        res.code(404).end(); //Error keine Daten von WL
      }*/
        });//csv parse
      }

  });//request auf csv
});// post request auf Bahnsteige

app.post('/getHSData', function(req, res){
  console.log('Haltestellen werden geladen...');
  request.get('https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv',
    function(err, response, body){
      if(!err && res.statusCode == 200){
        //console.log(body);
        csv.parse(body, {delimiter:';'}, function(error, data){
          //console.log(data);
        //  for(let i = 1; i < data.length; i++){
        //    if(data[i][3] != '')
        //  }
        })
      }

    }); //get request
});//post request auf Haltestellen
