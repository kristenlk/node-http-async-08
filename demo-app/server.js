var http = require('http'),
    url = require('url');

var server = http.createServer(function(request, response) {

  // CORS Policy
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Request-Method', '*');
  // Parse the URL

  var parsedUrl = url.parse(request.url, true);
  path = parsedUrl.pathname.toLowerCase(),
  method = request.method;

// Routing and Control
  console.log(path + " : " + method);

  if (path === '/statues' && method === 'GET') { //index
    var statues = fakeDB['statues'];
    console.log(statues);
    response.writeHead(200, {'Content-Type' : 'text/json'});
    response.end(JSON.stringify({statues: statues}));
  } else if (path.indexOf('/statues') >= 0 && method === 'POST') { //index
    var messageBody = '';
    request.setEncoding('utf8');
    request.on('data', function(chunk) { messageBody += chunk; })
    request.on('end', function() {
      var data = JSON.parse(messageBody);
      fakeDB['statues'].push(data.statue);
    });

    console.log(statues);
    response.writeHead(200, {'Content-Type' : 'text/json'});
    response.end(JSON.stringify({statues: statues}));
  }

  else if (path === '/wizards' && method === 'GET') { //index
    var wizards = fakeDB['wizards'];
    console.log(wizards);
    response.writeHead(200, {'Content-Type' : 'text/json'});
    response.end(JSON.stringify({wizards: wizards}));
  }

  else if (path === '/pigs' && method === 'GET') { //index
    var pigs = fakeDB['pigs'];
    console.log(pigs);
    response.writeHead(200, {'Content-Type' : 'text/json'});
    response.end(JSON.stringify({pigs: pigs}));
  }

  else if (method === "OPTIONS") {
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.end("Pre-flight");
  } else {                              //404 - no path
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.end("Not Found");
  }

  debugger;
});

server.listen(8000, function(){
  console.log("Server is running on port 8000");
});

var fakeDB = {
  statues: [
    {name: "David", location: "Florence, Italy"},
    {name: "Liberty", location: "New Jersey, USA"},
    {name: "Redeemer", location: "Rio De Janeiro, Brazil"}
  ],
  wizards: [
    {name: "Gandalf", universe: "Lord of the Rings"},
    {name: "Dumbledore", universe: "Harry Potter"},
    {name: "Oz the Great and Terrible", universe: "The Wizard of Oz"}
  ],
  pigs : [
    {name: "Wilbur"},
    {name: "Babe"},
    {name: "Miss Piggy"}
  ]
}
