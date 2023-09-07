const express = require('express')
const router = express.Router()

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date()
  }
];

router.get('/', function(req, res, next){
  res.render('index', {title: 'Mini Message Board', messages: messages})
})

router.post('/', function(req, res, next){
  console.log(req.body);
  const {user, text} = req.body;

  messages.push({
    text,
    user,
    added: new Date()
  })

  console.log(messages);

  res.redirect('/');
})

module.exports = router;