var fs = require ('fs'); // Filesystem
var express = require ('express'); //Server
var bp = require('body-parser'); //Request Inhalte zulassen

var app = express();

var server = app.listen(4000, function(){
  console.log('Server gestartet. http//:localhost:4000')

});
/*
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST');
  next(); //NICHT VERGESSEN!
});
*/
app.use(express.static( 'static' ));// in dem ordner static liegen alle statische datein

app.use(bp.urlencoded({extended:true}));//POST request

app.post('/', function(req, res){
  res.writeHead(200,{'Content-Type':'text/html'});
  res.end('OK');
});

app.get('/', function(req, res){
  fs.readFile('d12-orterequest.html', function(err, data){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(data);
  });
});
