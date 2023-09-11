const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the ticket holder
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model for the booked event
    required: true,
  },
  // Add any other ticket-related fields here, if needed.
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
