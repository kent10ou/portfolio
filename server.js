'use strict';
const fs = require('fs');
const config = require('./config');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const request = require('request');
const reCAPTCHA = require('recaptcha2');
const app = express();
const PORT = process.env.PORT || 8080;
const privateKey = fs.readFileSync('./sslcert/domain.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/domain.crt', 'utf8');

var options = {
  key: privateKey,
  cert: certificate
 // requestCert: false,
 // rejectUnauthorized: false
};

const recaptcha = new reCAPTCHA({
  siteKey: 'config.SITEKEY',
  secretKey: 'config.SECRET'
});



// Static Files
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('YES IT WORKS');
});

app.get('/.well-known/acme-challenge/eWT1nuCSNOa14MAnMfTqGMxbgZbi-kqQbj-qnpmn3J0', (req, res) => {
    res.send('eWT1nuCSNOa14MAnMfTqGMxbgZbi-kqQbj-qnpmn3J0.l9G_VGS6iEqJvKr4Btcbgcv2LRGv1dAgFSxD3-eGdGQ');
});


app.post('/send_message', urlencodedParser, (req, res) => {
  console.log('REQDATBODY: ', req.connection.remoteAddress);
    // setup email data with unicode symbols
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
      user: config.EMAIL,
      pass: config.PASSWORD
    }
  });

  transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
  });


  let mailOptions = {
    from: req.body.name + ' <' + req.body.email + '>', // sender address
    to: 'kent10ou@gmail.com', // list of receivers
    subject: 'Portolio Page Contact Form', // Subject line
    text: 'From: <' + req.body.email + '> Message: ' + req.body.message, // plain text body
  };

  console.log('MAILOPTIONS: ', mailOptions);
/*
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
          return console.log('ERROR IN TRANSPORTER: ', error);
      } else {
        console.log('RESPONSE: ', response);
        console.log('Message %s sent: %s', response.messageId, response.response);
        // res.render('contact', { title: 'Kent Ou - Contact', msg: 'Message sent! Thank you.', err: false, page: 'contact' });
      }
    });
*/

/*
  recaptcha.validateRequest(req, req.connection.remoteAddress)
  .then(function(){
    // validated and secure
    console.log('recaptcha success!');
    res.json({formSubmit:true})
  })
  .catch(function(errorCodes){
    // invalid
    console.log('recaptcha FAIL!');
    res.json({formSubmit:false,errors:recaptcha.translateErrors(errorCodes)});// translate error codes to human readable text
  });
*/

  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  var secretKey = config.SECRET;
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  console.log('verificationUrl: ', verificationUrl);
  request(verificationUrl, function(error, response, body) {
    body = JSON.parse(body);
    console.log('grecaptcha-response: ', body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    else {
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            return console.log('ERROR IN TRANSPORTER: ', error);
        } else {
          console.log('RESPONSE: ', response);
          console.log('Message %s sent: %s', response.messageId, response.response);
          // res.render('contact', { title: 'Kent Ou - Contact', msg: 'Message sent! Thank you.', err: false, page: 'contact' });
        }
      });
  
      res.json({"responseCode" : 0,"responseDesc" : "Success"});
    }
  });

});


// This will handle 404 requests.
app.use("*", function (req,res) {
  res.status(404).send("404");
});


// === HTTP SERVER ===
const server = app.listen(PORT, function () {
  console.log('host: ', server.address())
  const host = server.address().address;
  const port = server.address().port;
  console.log("http Server listening on: http://[%s]:%s", host, port);
});

/*
// === HTTP SERVER ===
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  const host = httpServer.address().address;
  const port = httpServer.address().port;
  console.log('http server listening on: http://[%s]:%s', host, port);
});
*/
/*
// === HTTPS SERVER ===
const httpsServer = https.createServer(options, app)
  .listen(8080, () => {
    const host = httpsServer.address().address;
    const port = httpsServer.address().port;
    console.log("HTTPS server listening on: https://[%s]:%s", host, port);
});
*/
