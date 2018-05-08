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

  var parseCSV = function(body){
    return new Promise( function( resolve, reject){
      csv.parse(body, {delimiter:';'}, function(err, data){
      if(err) {reject()}
      else {resolve(data) }
      });

    });
  }

var saveWLJSON = function (linien, steige, haltestellen){
  return new Promise( function( resolve, reject){

    var ubahnen = {}; //alle Infos in einem Objekt zusammengeführt

    for( let i in linien){
      if ( linien[i][4] != 'ptMetro') continue;

      //UBahn gefunden und jetzt?
      ubahnen[ linien[i][1]] = {
        id: linien[i][0]*1,
        haltestellen: [],
      };

      for( let j in steige){
        if( steige[j][1] != linien[i][0]) continue;

        //überprüfe ob haltestelle schon existiert (da es immer 2 steige gibt)
        var hsExists = -1;
        for(let k in ubahnen[ linien[i][1]].haltestellen) {
          if(ubahnen[linien[i][1] ].haltestellen[k].id == steige[j][2]) {
            hsExists = k;
            break;
          }
        }
        //passender bahnsteig was jetzt?
        if(hsExists == -1){
          ubahnen[linien[i][1] ].haltestellen.push( {
            id:steige[j][2]
          });
          hsExists = ubahnen[linien[i][1] ].haltestellen.length -1;
          for (let l in haltestellen){
            if(steige[j][2] != haltestellen[l][0]) continue;
            ubahnen[linien[i][1] ].haltestellen[hsExists].name = haltestellen[l][3];
            ubahnen[linien[i][1] ].haltestellen[hsExists].lat = haltestellen[l][6] *1;
            ubahnen[linien[i][1] ].haltestellen[hsExists].lng = haltestellen[l][7] *1;
          }
        }
        //jede haltestelle hat 2 bahnsteige
          ubahnen[linien[i][1] ].haltestellen[hsExists]['steig'+steige[j][3]] =
          steige[j][5];

        // reihenfloge
        if( steige[j][3] == 'H'){
          ubahnen[linien[i][1] ].haltestellen[hsExists].reihenfolge = steige[j][4];
        }

      }
      //console.log(ubahnen[linien[i][1] ].haltestellen );
    }
      //console.log(ubahnen)
    fs.writeFile('ubahnen_alle.json', JSON.stringify(ubahnen), function(){
      resolve();

    });
  });
}

//HTML für UI
app.get( '/', function(request, response){

//Import Daten von Wiener Linien

//1. Lade Linien csv
var dataLinien, dataSteige, dataHaltestellen, dataJSON;
loadWLData(urlLinienCSV)
  .then( function(contentCSV){                  //wenn request erfolgreich ist mach das
    console.log('CSV1 geladen');
    //console.log(contentCSV);
    return parseCSV(contentCSV);
    })
  .then( function(dataCSV) {
    dataLinien = dataCSV;
    console.log('CSV1 Daten geparst');
    //console.log(dataCSV);
    return loadWLData(urlSteigeCSV);
  })
  .then( function (contentCSV) {
    console.log('CSV2 geladen');
    return parseCSV(contentCSV);
  })
  .then( function (dataCSV) {
    dataSteige = dataCSV;
    console.log('CSV2 Daten geparst');
    return loadWLData(urlHaltestellenCSV);
  })
  .then( function (contentCSV) {
    console.log('CSV3 geladen');
    return parseCSV(contentCSV);
  })
  .then( function (dataCSV) {
    dataHaltestellen = dataCSV;
    console.log('CSV3 Daten geparst');
    return saveWLJSON( dataLinien, dataSteige, dataHaltestellen);

  })
  .then(function (){
    console.log('Daten in JSON gespeichert');
    response.end('FERTIG');
  })
  .catch( function(){console.log('CSV Ladefehler') }); //wenn nicht erfolgreich dies

//2. Parse linien csv
//3. Lade Bahnsteige CSV
//4. parse Bahnsteige CSV
//5. lade haltestellen CSV
//6. Parse haltestellen CSV

});

app.get( '/json', function(request, response){
  response.sendFile(
    __dirname+'/ubahnen_alle.json');
});
