require('dotenv').config();

const express = require('express');

const cors = require('cors');

const app = express();

const morgan = require('morgan');

const mongoose = require('mongoose');
const Person = require('./models/person');

const url = process.env.MONGODB_URI;

mongoose.connect(url);

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(cors());

app.use(express.json());

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

app.use(express.static('build'));

app.get('/', (request, response) => {
  response.send('<h1 color= red >Hola mundo, si esta funcionando?</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get('/info', (request, response) => {
  const amountOfPeople = Person.length;
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${amountOfPeople} people</p><p>${date}</p>`,
  );
});

/* eslint-disable */
app.post('/api/persons', async (request, response, next) => {
  const { body } = request;
  const existUsername = await Person.findOne({ name: body.name });
  if (existUsername) {
    response.status(409).end();
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  }).catch((err) => next(err));
});
/* eslint-enable */

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;

  Person.findById(id).then((person) => (person
    ? response.json(person)
    : response.status(404).end())).catch((err) => next(err));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;

  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end();
  })
    .catch((err) => next(err));
});

app.patch('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  const { body } = request;

  const person = {
    // name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then((newPerson) => response.json(newPerson))
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

/* eslint-disable */
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  
  next(error);
  return response.status(500);
};
/* eslint-enable */

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
});
