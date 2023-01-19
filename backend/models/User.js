const mongoose = require('mongoose'); // importation de mongoose

const uniqueValidator = require('mongoose-unique-validator'); // plugin validateur de données unique

// schema type
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // userShema utilise le plugin uniqueValidator

module.exports = mongoose.model('User', userSchema); // exportation du schema
