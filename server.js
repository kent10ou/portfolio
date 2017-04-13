'use strict';
const config = require('./config');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 8080;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Static Files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send()
})

app.post('/send_message', urlencodedParser, (req, res) => {
  console.log('REQDATBODY: ', req.body);
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

  // setup email data with unicode symbols
  let mailOptions = {
      from: req.body.name + ' <' + req.body.email + '>', // sender address
      to: 'kent10ou@gmail.com', // list of receivers
      subject: 'Portolio Page Contact Form', // Subject line
      text: 'From: <' + req.body.email + '> Message: ' + req.body.message, // plain text body
      // html: '<b>Hello world ?</b>' // html body
  };

  console.log('MAILOPTIONS: ', mailOptions);

  transporter.verify(function(error, success) {
      if (error) {
          console.log(error);
      } else {
          console.log('Server is ready to take our messages');
      }
  });

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
          return console.log('ERROR IN TRANSPORTER: ', error);
      } else {
          console.log('RESPONSE: ', response);
          console.log('Message %s sent: %s', response.messageId, response.response);
          res.render('contact', { title: 'Kent Ou - Contact', msg: 'Message sent! Thank you.', err: false, page: 'contact' });
      }
  });

  // res.send({ success: true });
  res.end();
})


const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Server listening on: http://[%s]:%s", host, port);
})
