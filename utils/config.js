require('dotenv').config()
const PORT = process.env.PORT

let MONGODB_URI = process.env.MONGODB_URI
let unifiedTopology = true;
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
  unifiedTopology = false;
}

module.exports = {
  MONGODB_URI,
  PORT,
  unifiedTopology
}