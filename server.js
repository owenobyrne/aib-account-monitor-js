
var express = require('express'),
    app = express();

app.configure(function(){
  app.use(express.static("C:/Owen/workspace/aib-account-monitor-js/WebContent/"));
});

app.get('/', function(req, res){
  res.sendfile("C:/Owen/workspace/aib-account-monitor-js/WebContent/index.html");
});

app.listen(8080);