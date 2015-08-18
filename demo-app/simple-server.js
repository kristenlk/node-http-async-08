var http = require('http'),
    url = require('url');

// every time a chunk of data came back from the server (through response), we would add it to the body, append it on, then once it was gathered, we would do a thing with it. we're doing the reverse now on the server side. every time something comes through through the request, we do a thing.

var server = http.createServer(function(request, response){
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Request-Method', '*');

  var parsedUrl = url.parse(request.url, true),
  // pathname is the part of the URL that precludes the query string.
  path = parsedUrl.pathname.toLowerCase(),
  method = request.method;
// if I go to localhost:8000/testpath#section?test=matt, that stuff will come back as part of the url (when I do request.url).
// gives us a new object interface to the url:
  // path: gives us the full thing
  // pathname: just the thing we care about
  // query: the query part of the url
// If I do parsedUrl in the console, can see the various things that the url module gives me.


// I'm the client - I send these chunks
  var messageBody = '';
  request.setEncoding('utf8');
  // every piece of data that comes in - read it as utf-8
  request.on('data', function(chunk){ messageBody += chunk; });
  request.on('end', function(){
    console.log('Request received.');
    // console.log(messageBody); // this would be useful for non-GET requests
  })
  // when you're finished getting data, we want you to run a different callback too. In particular, every time we get a chunk of data, we want to take the messageBody and add that chunk to it.

  response.writeHead(200, {'Content-Type' : 'text/plain'});
  // The first parameter is the HTTP code, the second is the data type of the response.
  response.end('<p>some html</p>');
  // Similar to what we did when we sent requests! Passing in an argument to '.end' is the same as passing
  // that same argument into '.write', and then calling '.end' with no arguments.
  // so if I go to localhost:8000/test?a=23 now, I'll see "All systems go." on the page.


  debugger;

});


server.listen(8000, function(){
  console.log("Server is running on port 8000");
});
