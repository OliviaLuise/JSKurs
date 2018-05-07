//server-loadWL
//lädt CSV Daten von WienerLinien und fügt sie zu einem JSON zusammen

// Benötigte Module
var express = require('express');
var bp = require('body-parser');
var fs = require('fs');
var request = require('request');
var csv = require('csv');

//Startet express Applikation bzw Server
var app = express();

var server = app.listen(5001, function(){
  console.log('Server läuft auf Port 5001');
});

//Standardfunktionen für statische Files und POST Requests
app.use(bp.urlencoded({extended:true}));
app.use(express.static('static'));

var urlLinienCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-linien.csv';
var urlSteigeCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-steige.csv';
var urlHaltestellenCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv';

var loadWLData = function(url){
  return new Promise( function(resolve, reject){
    request.get(url, function(err, response, body){
      if(!err && response.statusCode == 200){
        resolve(body);
      } else {
        reject();
      }
    });
  });
}
//HTML für UI
app.get( '/', function(request, response){

//Import Daten von Wiener Linien

//1. Lade Linien csv
loadWLData(urlLinienCSV)
  .then( function(){                  //wenn request erfolgreich ist mach das
    console.log('CSV1 geladen');
    return loadWLData(urlSteigeCSV);
    })
  .then( function() {
    console.log('CSV2 geladen');
    return loadWLData(urlHaltestellenCSV);
  })
  .then( function () {
    console.log('CSV3 geladen');
  })
  .catch( function(){console.log('CSV Ladefehler') }); //wenn nicht erfolgreich dies

response.end('FERTIG')
//2. Parse linien csv
//3. Lade Bahnsteige CSV
//4. parse Bahnsteige CSV
//5. lade haltestellen CSV
//6. Parse haltestellen CSV

});
