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

let persons = [];

app.get('/', (request, response) => {
  response.send('<h1 color= red >Hola mundo, si esta funcionando?</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get('/info', (request, response) => {
  const amountOfPeople = persons.length;
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${amountOfPeople} people</p><p>${date}</p>`,
  );
});

app.post('/api/persons', (request, response) => {
  const { body } = request;
  // if (!person.name || !person.number) {
  //   return response.status(400).json({ error: 'name or number is missing' });
  // }

  // if (persons.find((p) => p.name === person.name)) {
  //   return response.status(409).json({ error: 'name must be unique' });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  Person.findById(id).then((note) => response.json(note));
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);
  response.status(204).end();
});

const { PORT } = process.env;
app.listen(PORT, () => {
});
