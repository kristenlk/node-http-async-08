var http = require('http');

var getStatues = function () {
  var getStatuesRequest = http.request({
    hostname: 'localhost',
    port: 8000,
    path: '/statues',
    method: 'GET'
  }, function(response) {
    console.log('got response')
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function(){
      var data = JSON.parse(body);
      data.statues.forEach(function(statue){
        console.log(statue);
      });
    });
  }).on('error', function(e) {
    console.log(e);
  });
  getStatuesRequest.end();
};

var getWizards = function () {
  var getWizardsRequest = http.request({
    hostname: 'localhost',
    port: 8000,
    path: '/wizards',
    method: 'GET'
  }, function(response) {
    console.log('got response')
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function(){
      var data = JSON.parse(body);
      data.wizards.forEach(function(wizard){
        console.log(wizard);
      });
    });
  }).on('error', function(e) {
    console.log(e);
  });
  getWizardsRequest.end();
};

var getPigs = function () {
  var getPigsRequest = http.request({
    hostname: 'localhost',
    port: 8000,
    path: '/pigs',
    method: 'GET'
  }, function(response) {
    console.log('got response')
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function(){
      var data = JSON.parse(body);
      data.pigs.forEach(function(pig){
        console.log(pig);
      });
    });
  }).on('error', function(e) {
    console.log(e);
  });
  getPigsRequest.end();
};

var createStatue = function() {

  var statueData = JSON.stringify({
    statue : {
      name: process.argv[3],
      location: process.argv[4]
    }
  });

  var createStatuesRequest = http.request({
    hostname: 'localhost',
    port: 8000,
    path: '/statues',
    method: 'POST'
  },
  function(response) {
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function(){
      console.log("Statue created");
      console.log(body);
    });
  }).on('error', function(e) {
    console.log(e);
  });

  createStatuesRequest.write(statueData);
  createStatuesRequest.end();
}


if (process.argv[2] === 'statues' && process.argv[3] && process.argv[4]) {
  createStatue();
}
else if (process.argv[2] == 'statues') {
  getStatue();
}
else if (process.argv[2] === 'wizards') {
  getWizards();
}
else if (process.argv[2] === 'pigs') {
  getPigs();
}
