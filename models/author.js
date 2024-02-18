const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require('luxon')

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
	return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : ""
})

AuthorSchema.virtual("date_of_death_formatted").get(function () {
	return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : ""
})

AuthorSchema.virtual("lifespan").get(function () {
	return `${this.date_of_birth} - ${this.date_of_death}`
})

const formatDate = (date) => {
  if (date === null) {
    return ""
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

AuthorSchema.virtual("dob_ymd").get(function () {
  return formatDate(this.date_of_birth)
})

AuthorSchema.virtual("dod_ymd").get(function () {
  return formatDate(this.date_of_death)
})


// Export model
module.exports = mongoose.model("Author", AuthorSchema);
