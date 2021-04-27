'use strict';

//============Application Dependencies=============
const express = require('express');
const cors = require('cors');
const { request } = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 3001;


const app = express();

app.use(cors());

//============Application Routes=============
app.get('/ping', (request, response) => {
  try {
    response.status(200).send('pong');
  } catch(error) {
    console.error(error);
    response.status(404).send(error);
  }
});

const mongoose = require('mongoose'); // get mongoose
mongoose.connect('mongodb://localhost:27017/cats', {useNewUrlParser: true, useUnifiedTopology: true});

// const Cat = mongoose.model('Cat', {name: String});

// const kitty = new Cat({name: 'Zildijan'});
// kitty.save().then(() => console.log('Meow'));

//store value of mongoose connection
const db = mongoose.connection;

//expects an event
db.on('error', console.error.bind(console, 'connection error:'));

//once is a kind of on that only runs once
db.once('open', function () {
  console.log('mongoose is connected')
});

//get reference to schema
// new objects expect a key and a type of data
const kittySchema = new mongoose.Schema({
  name: String
});

//what is mongoose.model? It's a class that creates a document repersenting a kitten here.
//expects a string and a schema
const Kitten = mongoose.model('Kitten', kittySchema);

const silence = new Kitten({name: 'silence'});
silence.save();

app.get('/kitties', (request, response) => {
  const catName = request.query.catName;
  console.log(catName);

  Kitten.find({ catName }, (err, Kitten) => {
    if (err) return console.error(err);
    console.log(Kitten);
    response.send(Kitten);
  });

});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
