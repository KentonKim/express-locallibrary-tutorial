// Import mongoose module
const mongoose = require('mongoose')

/* Set 'strictQuery: false' to globally op into
filtering by properties that aren't in the schema
Included because it removes prepatory warnings for
Mongoose 7 */
mongoose.set('strictQuery', false)

// Define db URL to connect to
const mongoDB = require('./mongoDB.txt') 

// Wait for db to connect, log error if problem
main().catch((err) => console.log(err))
async function main() {
	await mongoose.connect(mongoDB)
}
