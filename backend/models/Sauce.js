const mongoose = require('mongoose'); // importation de mongoose

// schema type
const sauceSchema = mongoose.Schema({

  userId: { type: String, required: true },
  
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },

  // système de like/dislike
  likes: { type: Number, default: 0, required: false },
  dislikes: { type: Number, default: 0, required: false },
  usersLiked: { type: [String], default: [], required: false },
  usersDisliked: { type: [String], default: [], required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema); // exportation du schema