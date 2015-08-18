var http = require('http');
    async = require('async');
    base64 = require('base-64');

var accessKey;

var register = function(){
  var registerData = JSON.stringify({
    credentials : {
      email: process.argv[3],
      password: process.argv[4]
    }
  });
  var registerRequest = http.request({      // http.request(options,callback) => ClientRequest
    hostname: 'localhost',
    port: 8880,
    path: '/register',
    method: 'POST'
  }, function(response) {                        // 'done' handler
    // This is what's actually handling our data.
    // This is saying "when we begin to get a response back"
    // .setEncoding converts any data that comes in into utf8 format
    // Any time a chunk of data comes in, we append it to the stream
    // When we receive all the chunks of data, we
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function(){
      console.log(body);
    });
  }).on('error', function(e) {              // error handler
    console.error('problem with request: ' + e.message);
  });

  registerRequest.write(registerData);      // write data to request body
  registerRequest.end();                    // 'end' the message, sending it out
};


// login() is called near the end of this file, only if the 3rd argument is "login."
var login = function(cb){
  // It's not possible to send a JS object down the wire - need a string. Only numbers and strings can be sent back and forth. If we want a JS object from one end to appear on the other end, we need to JSONify it.
  // this loginData goes in the .write() at the end.
  // this is what we as the client are sending the server.
  var loginData = JSON.stringify({
    credentials: {
      email: process.argv[3],
      password: process.argv[4]
    }
  });
  // generates a request object (loginRequest). http.request takes 2 arguments, one of which is a hash, the other is a handler


  var loginRequest = http.request({
    hostname: 'localhost',
    port: 8880,
    path: '/login',
    method: 'POST'
  }, function(response){

    console.log('Successfully logged in.');

    var body = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function(){
      // This is turning the string back into a JS object.
      var data = JSON.parse(body);
      // Body is a string in JSON format.
      // console.log("body: " + body);
      accessKey = data.accessKey;
      // console.log("data.accessKey: " + data.accessKey);

      // This is saying that if a callback is attached, execute the callback at the end of the login function.
      // if(cb) cb(null);
      if (cb) {cb(null, "Logged user in.");};
    });

  }).on('error', function(e){
    console.error(e);
    cb(e, null);
  });

// Have to do this in Node:
// Have created a pipeline with log in, but until we actually write it, no data goes down the pipe.
  loginRequest.write(loginData);
  loginRequest.end();
};


//////////


var getDocuments = function(cb){ // can also just do 'http://localhost:8881', callback
  // var documentData = '';

  var getDocumentsRequest = http.request({
    hostname: 'localhost',
    port: 8881,
    path: '/documents',
    method: 'GET',
    headers: {
      'Authorization': "Basic " + base64.encode(accessKey)
    }
  }, function(response){

    console.log('Successfully retrieved documents.');

    var messageBody = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      messageBody += chunk;
    });
    response.on('end', function(){
      // This is turning the string back into a JS object.
      var data = JSON.parse(messageBody);
      // Body is a string in JSON format.
      // console.log(data.documents);
      // If I try to console.log data here, I just get [object Object]
      data.documents.forEach(function(document){
        console.log(document.content);
      });
      if (cb) {cb(null, "Retrieved documents.");};
    });

  }).on('error', function(e){
    console.error(e);
    cb(e, null);
  });

// Have to do this in Node:
// Have created a pipeline with log in, but until we actually write it, no data goes down the pipe.
  // getDocumentsRequest.write(documentData);
  // this fires the request object
  getDocumentsRequest.end();
};



// Calling the login / register function, depending on what the 3rd argument is (i.e. if we call node console-client.js login test@test.com test in the command line, it would log the person in.)
if (process.argv[2] === "register") {
  register();
} else if (process.argv[2] === "login") {
  login();
} else if (process.argv[2] === "getDocuments") {
  // putting in getDocuments itself as a callback so that it gets executed ONLY AFTER a user gets logged in. Before this (because of async), I was asking for documents prior to actually logging in.
  login(getDocuments);
  // async.series takes an array, and a callback (the handler accomplishes two jobs: if you hit an error at any point in the process, it'll immediately jump to the callback and do whatever it's supposed to do with err. If it completes successfully, it jumps to results, where it does stuff.)
  // an array's elements are ORDERED, so if we want to specify something in a series, order is important. The array is where we are going to put each of our individual steps in the series. The array is a series of anonymous functions (a function I'm not executing now - I'll execute it later). The anonymous functions are representing each discrete step in our process. Each one needs to have a callback as an argument.
  async.series([
      // function(callback){ // step one

      // },
      // function(callback){ // step two

      // },
      login,
      getDocuments
    ],
    function(err, results){
      if (err) {console.error(err);}
      console.log(results);
    }
  );
}

// the cb in both login and getDocuments is a little helper. the little helper will invoke either the final step in the process or an error.
// null (in cb(null)) is triggering a helper function, which has 2 arguments (one is error, one is result.) At any stage in the process, once it's done, you either have an error or a result. If you have an error (if the first argument is not null), then jump all the way to the end. cb(null) is saying we have no errors, please proceed.

// each chunk has a result, which becomes an array.

// instead of needing to know exactly what comes next:
// every one of our steps is going to get this helper callback, and only that helper callback. the inner machinery of async will take care of grabbing the next step in the process and running it.

// series, waterfall, and parallel are the 3 most commonly used async methods.

// var input = 2;
// async.waterfall([
//   function(callback){
//     var result = input * 2;
//     callback(null, result);
//   };
//   function(input, callback){
//     var result = input + 1;
//     // if we pass any of the helper callbacks an error, they will immediately stop and go to the end.
//     callback('error at step 2', null);
//   };
//   function(input, callback){
//     var result = input * input;
//     callback(null, result);
//   };

//   ], function(err, result){
//     if (err) {console.error(err);}
//     else {
//       console.log(result);
//     }
//   }
// );

// result should be 25
