const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const nameToAdd = process.argv[3];
const numberToAdd = process.argv[4];

const password = process.argv[2];

const url = `mongodb+srv://olivier:${password}@cluster0.ylmug.mongodb.net/phonebookappdb?retryWrites=true&w=majority`;

const personSchema = new Schema({
  name: String,
  number: Number,
});

const Person = model('Person', personSchema);

mongoose.connect(url).then(() => {
  console.log('connected');

  if (process.argv.length === 3) {
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person.name, person.number);
        // console.log(person.number);
      });
      mongoose.connection.close();
      process.exit();
    });
  }

  if (nameToAdd && numberToAdd) {
    const person = new Person({
      name: nameToAdd,
      number: numberToAdd,
    });
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    person.save().then(() => {
      console.log('saved');
      return (mongoose.connection.close());
    }).catch((err) => console.log(err));
  }
});
