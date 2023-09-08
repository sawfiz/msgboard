require('dotenv').config();
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);
const Message = require('../models/message');

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

// Connect to the database when the app starts
connectToDatabase();

async function readCollectionToArray() {
  try {
    // Query the collection and retrieve documents
    return await Message.find().lean(); // Use .lean() for plain JavaScript objects
  } catch (error) {
    console.error('Error reading collection:', error);
  }
}

router.get('/', async function (req, res, next) {
  try {
    const messages = await readCollectionToArray();
    // Reverse the order of the messages array
    const reversedMessages = messages.reverse();
    res.render('index', { title: 'Mini Message Board', messages: reversedMessages });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

router.post('/', async function (req, res, next) {
  console.log(req.body);
  const { user, text } = req.body;
  try {
    const newMsg = new Message({ user, text, added: new Date() });
    await newMsg.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error saving message:', error);
    next(error);
  }
});

module.exports = router;
