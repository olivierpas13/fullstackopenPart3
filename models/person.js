const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const url = process.env.MONGODB_URI;

/* eslint-disable */
mongoose.connect(url)
  .then(() => console.log('Conected'))
  .catch((err) => console.log(`error in mongodb: ${err.message}`));
/* eslint-enable */

const personSchema = new Schema({
  name: String,
  number: Number,
});

/* eslint-disable */
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
/* eslint-enable */

module.exports = model('Person', personSchema);
