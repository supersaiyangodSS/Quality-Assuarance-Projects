require('dotenv').config();

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {})
  .then(
    () => {
      console.log('Successfully connected to MongoDB.');
    },
    e => {
      // Catch any errors
      console.error(e);
      throw new Error('Unable to Connect to Database');
    },
  );

module.exports = mongoose;
