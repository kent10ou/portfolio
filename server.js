const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

const PORT = 8080;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Static Files
app.use(express.static('public'));

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kent10ou@gmail.com',
    pass: 'yourpass'
  }
});

let mailOptions = {
  from: '"Fred Foo" <foo@blurdybloop.com>',
  to: 
}

// Routes
app.get('/', (req, res) => {
  res.send()
})

app.post('/send_message', urlencodedParser, (req, res) => {

})


const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Server listening on: http://[%s]:%s", host, port);
})
