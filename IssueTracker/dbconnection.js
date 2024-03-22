require('dotenv').config();
const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
//const databaseName = 'issueTracker';

module.exports = async function (callback) {
  try {
    await client.connect();
    console.log('Connected successfully to database');
    
    await callback(client);
    
  } catch (err) {
    console.error(err);
    throw new Error('Unable to connect to database');
  }
}

