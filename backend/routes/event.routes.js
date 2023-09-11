const express = require('express');
const eventRouter = express.Router();
const Event = require('../models/event');
const authMiddleware = require('../middleware/auth'); 



eventRouter.get("/all", async(req,res) => {
    try{
     const allEvent = await Event.find()
     console.log(allEvent)
     res.status(200).send(allEvent)

    }
    catch(err){
        console.error(err.message)
    }
})

eventRouter.post('/create', authMiddleware, async (req, res) => {
    const { title, description, date, venue, price } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            venue,
            organizer: req.userId,
            price
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully.', event: newEvent });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Event creation failed. Please try again later.' });
    }
});

// Event retrieval endpoint
eventRouter.get('/', authMiddleware, async (req, res) => {
    try {
        const userEvents = await Event.find({ organizer: req.userId });
        res.status(200).json({ userEvents });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Event retrieval failed. Please try again later.' });
    }
});

// Event Update endpoint
eventRouter.put('/:id', authMiddleware, async (req, res) => {
    const eventId = req.params.id;
    const { title, description, date, venue } = req.body;
    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (event.organizer.toString() !== req.userId) {
            return res.status(403).json({ error: 'You do not have permission to update this event.' });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.venue = venue || event.venue;

        await event.save();

        res.status(200).json({ message: 'Event updated successfully.', event });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Event update failed. Please try again later.' });
    }
});
eventRouter.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const deleteEvent = await Event.findByIdAndDelete(id);
        if (!deleteEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Event deletion failed. Please try again later.' });
    }
});



module.exports = eventRouter;
