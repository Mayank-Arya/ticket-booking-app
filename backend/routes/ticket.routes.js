const express = require('express');
const ticketRouter = express.Router();
const Ticket = require('../models/ticket');
const Event = require('../models/event');
const authMiddleware = require('../middleware/auth');

// Create Ticket endpoint
ticketRouter.post('/', authMiddleware, async (req, res) => {
    const { eventId } = req.body;
    try {
        // Check if the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Create a new ticket associated with the logged-in user and the event
        const newTicket = new Ticket({
            user: req.userId,
            event: eventId,
        });

        await newTicket.save();
        res.status(201).json({ message: 'Ticket booked successfully.', ticket: newTicket });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ticket booking failed. Please try again later.' });
    }
});


ticketRouter.get('/user', authMiddleware, async (req, res) => {
    try {
        // Retrieve tickets associated with the logged-in user
        const userTickets = await Ticket.find({ user: req.userId }).populate('event');
        res.status(200).json({ userTickets });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ticket retrieval failed. Please try again later.' });
    }
});



ticketRouter.delete('/:ticketId', authMiddleware, async (req, res) => {
    const ticketId = req.params.ticketId;
    try {
        // Find and delete the ticket by its ID
        const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

        if (!deletedTicket) {
            return res.status(404).json({ error: 'Ticket not found.' });
        }

        res.status(200).json({ message: 'Ticket canceled successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ticket cancellation failed. Please try again later.' });
    }
});

module.exports = ticketRouter;
