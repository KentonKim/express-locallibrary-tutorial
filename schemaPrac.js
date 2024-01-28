const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Creating a Schema
const SomeModelSchema = new Schema({
	name: String,
})

// Creating a model
const SomeModel = mongoose.model('SomeModel', SomeModelSchema)

// Schema Types
const schema = new Schema({
	name: String,
	binary: Buffer,
	living: Boolean,
	updated: {
		type: Date,
		default: Date.now()
	},
	age: {
		type: Number,
		min: 18,
		max: 65,
		required: true
	},
	mixed: Schema.Types.Mixed,
	_someId: Schema.Types.ObjectId,
	array: [],
	ofString: [String],
	nested: {
		stuff: {
			type: String,
			lowercase: true,
			trim: true
		}
	}
})

// Schema example
const breakfastSchema = new Schema({
	eggs: {
		type: Number,
		min: [6, 'Too few eggs'],
		max: 12,
		required: [true, 'why no eggs?'],
	},
	drink: {
		type: String,
		enum: ["Coffee", "Tea", "Water"],
	},
})

// Creating and modifying documents
const awesome_instance = new SomeModel({ name: 'awesome'})
await awesome_instance.save()
// above is the same as
await SomeModel.create({ name: 'also_awesome '})

// Accessing data and updating
console.log(awesome_instance.name) // -> 'awesome'
awesome_instance.name = 'New cool name'
await awesome_instance.save()

// Searching for records
const Athlete = mongoose.model('Athlete', yourSchema)
// find all athletes who play tennis, returning 'name' and 'age' fields
const tennisPlayers = await Athlete.find(
	{ sport: 'Tennis'}, // query
	'name age', // output from each doc
).exec()

// Another query example
const query = Athlete.find({sport:'Tennis'})
query.select('name age')
query.limit(5)
query.sort({ age:-1 })
query.exec()
// Another way to write above query
Athlete.find()
	.where('sport')
	.equals('Tennis')
	.where('age')
	.gt('17')
	.lt('50')
	.sort({ age: -1 })
	.select('name age')
	.exec()

// Methods for finding one match
Athlete.findById()
Athlete.findOne()
Athlete.findByIdAndDelete()
Athlete.findByIdAndUpdate()
Athlete.findOneAndRemove()
Athlete.findOneAndUpdate()


// Working with related documments - population
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const authorSchema = new Schema({
	name: String,
	stories: [{
		type: Schema.Types.ObjectId, ref: "Story"
	}]
})

const storySchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref:"Author"},
	title: String,
})

const Story = mongoose.model('Story', storySchema)
const Author = mongoose.model("Author", authorSchema)

const bob = new Author({ name: "Bob Smith" })
await bob.save()

const story = new Story({
	title: "Bob goes sledding",
	author: bob._id
})

await story.save()

// Embedding a reference
Story.findOne({ title: "Bob goes sledding" })
	.populate('author')
	.exec()
// There is a problem above where the story is not added to the author's stories array
// There are two places where info relating authors and stories needs to be maintained
// A better way is to get the _id of author and use find() to search for this in author field across all stories
Story.find({ author: bob._id }).exec()