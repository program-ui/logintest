const mongoose = require('mongoose')




const dbConnect = async () => {try {
  await mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true})
  console.log('Connected to MongoDb');
} catch (error) {
  console.log('Something went wrong with Database connection');
  process.exit(1)
}}

module.exports = dbConnect