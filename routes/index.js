const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

// Define the database URL to connect to.
const mongoDB =
  'mongodb+srv://sawfizup:jeb_pzj4nbk1QVP_avh@cluster0.ciyysqy.mongodb.net/msg_board?retryWrites=true&w=majority';

// Wait for database to connect, logging an error if there is a problem
async function main() {
  await mongoose.connect(mongoDB);
  console.log('database connected');
}

main().catch((err) => console.log(err));

// Import the Message model
const Message = require('../models/message');

async function readCollectionToArray() {
  try {
    // Query the collection and retrieve documents
    const documents = await Message.find().lean(); // Use .lean() for plain JavaScript objects

    // Map the collection into an array of objects
    const dataArray = documents.map((document) => {
      return {
        _id: document._id,
        user: document.user,
        text: document.text,
        added: document.added,
      };
    });

    return dataArray;
  } catch (error) {
    console.error('Error reading collection:', error);
  }
  // finally {
  //   mongoose.disconnect(); // Close the database connection
  // }
}

router.get('/', async function (req, res, next) {
  try {
    const messages = await readCollectionToArray();
    res.render('index', { title: 'Mini Message Board', messages: messages });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

router.post('/', async function (req, res, next) {
  console.log(req.body);
  const { user, text } = req.body;

  const newMsg = new Message({user, text, added: new Date()})
  await newMsg.save();

  // messages.push({
  //   text,
  //   user,
  //   added: new Date(),
  // });

  res.redirect('/');
});

module.exports = router;
