require('dotenv').config()
const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const app = express();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

});

app.get('/api/friends', (req, res) => {

  // Get list of friends
  const friends = [];

  // Return them as json
  res.json(friends);

});

app.get('/api/twilio', (req, res) => {

  client.messages
  .create({
    to: process.env.MY_CELL,
    from: process.env.TWILIO_NUMBER,
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  })
  .then(message => {
    console.log(message.sid);
    res.json(message.sid);
  });

});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Listening on ${port}`);
