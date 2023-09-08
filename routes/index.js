require('dotenv').config();
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);
const Message = require('../models/message');

// Wait for database to connect, logging an error if there is a problem
async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('database connected');

  router.get('/', async function (req, res, next) {
    try {
      const messages = await readCollectionToArray();
      res.render('index', { title: 'Mini Message Board', messages: messages });
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  });
}

main().catch((err) => console.log(err));

// Import the Message model

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

    console.log("🚀 ~ file: index.js:55 ~ readCollectionToArray ~ dataArray:", dataArray)
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
