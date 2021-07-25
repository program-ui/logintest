const config = require('config')
const mongoose = require('mongoose')
const db = config.get('mongoURI');



const dbConnect = async () => {try {
  await mongoose.connect(db, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true})
  console.log('Connected to MongoDb');
} catch (error) {
  console.log('Something went wrong with Database connection');
  process.exit(1)
}}

module.exports = dbConnect