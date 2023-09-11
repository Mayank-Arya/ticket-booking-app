const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  venue: {
    type: String,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the event organizer
    required: true,
  },
  price: {
    type: Number,
    required:true
  }
  // Add any other event-related fields here, such as ticket price, maximum capacity, etc.
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
