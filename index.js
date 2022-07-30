const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hola mundo, si esta funcionando?</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const amountOfPeople = persons.length;
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${amountOfPeople} people</p><p>${date}</p>`
  );
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  if (persons.find((p) => p.name === person.name)) {
    return response.status(409).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000),
    name: person.name,
    number: person.number,
  };

  persons = [...persons, newPerson];

  response.json(newPerson);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  response.json(persons.find((note) => note.id === id));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("server running");
});
