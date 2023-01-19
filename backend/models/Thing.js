const mongoose = require('mongoose'); // importation de mongoose

// schema type
const thingSchema = mongoose.Schema({ 
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },

  // système de like/dislike
  likes: { type: Number, default: 0, required: false },
  dislikes: { type: Number, default: 0, required: false },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});

module.exports = mongoose.model('Thing', thingSchema); // exportation du schema