const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const generatePassword = require('password-generator');
const { Friend } = require('./models');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
// Get list of friends
app.get('/api/friends', (req, res) => {
  Friend.find({}, (err, foundFriends) => {
    if (err) {
      console.error(err);
      res.json({error: err});
    } else {
      // Return them as json
      res.json(foundFriends);
    }
  });
});

// Add new friend
app.post('/api/friends', (req, res) => {
  if (!req.body.name || !req.body.number)
    res.json({ error: 'missing name or number' });
  else {
    const { name, number } = req.body;
    const newFriend = new Friend({ name, number });
    newFriend.save((err, savedFriend) => {
      if (err) {
        console.error(err);
        res.json({ error: 'could not save friend' });
      } else res.json(savedFriend);
    });
  }
});

// Remove friend
app.delete('/api/friends/:friendId', (req, res) => {
  const friendId = req.params.friendId;
  if (!friendId)
    res.json({ error: 'missing friend Id' });
  else {
    Friend.deleteOne({ _id: friendId }, (err) => {
      if (err) {
        console.error(err);
        res.json({ error: err });
      } else res.json({ success: 'Successfully deleted.' });
    })
  }
});

// Send Text
app.get('/api/friends/:friendId/text', (req, res) => {
  const friendId = req.params.friendId;
  if (!friendId)
    res.json({ error: 'missing friend Id' });
  else {
    Friend.findOne({ _id: friendId }, (err, foundFriend) => {
      if (err) {
        console.error(err);
        res.json({ error: err });
      } else {
        console.log(foundFriend);
        const { number, name } = foundFriend;
        client.messages
          .create({
            to: number,
            from: process.env.TWILIO_NUMBER,
            body: `Hey, ${name}`,
          })
          .then(message => {
            console.log(message.sid);
            res.json(message.sid);
          });

      }
    })
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = app;