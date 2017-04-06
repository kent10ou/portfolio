var http = require('http');
var express = require('express');
var app = express.createServer();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var util = require('util');
var querystring = require('querystring');
var path = require('path');

const PORT = 8080;


function handleRequest(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('It Works!! Path Hit: ' + req.url + "\nWelcome to Kent10ou's site");
}

var server = http.createServer(handleRequest);

server.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT);
});
