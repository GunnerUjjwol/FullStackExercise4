require('dotenv').config()

const PORT = 3003

if (process.argv.length < 3) {
    logger.error('Please provide the password as an argument: node index.js <password>')
    process.exit(1)
  }
  
const password = process.argv[2];
const database = 'thebloglist'
const mongoUrl = `mongodb+srv://fullstack-course:${password}@cluster0.e8nyj.mongodb.net/${database}?retryWrites=true&w=majority`
const MONGODB_URI = mongoUrl

module.exports = {
  MONGODB_URI,
  PORT
}