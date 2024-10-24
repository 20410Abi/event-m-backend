const express = require('express');
const Event = require('../models/Event');
const router = express.Router();
const nodemailer = require('nodemailer');


// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new event
router.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.name,
        date: req.body.date,
        location: req.body.location,
        pricing: {
            free: parseFloat(req.body.pricing.free),
            advanced: parseFloat(req.body.pricing.advanced),
            pro: parseFloat(req.body.pricing.pro)
        }
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Edit an event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.name = req.body.name || event.name;
        event.date = req.body.date || event.date;
        event.location = req.body.location || event.location;
        event.pricing.free = parseFloat(req.body.pricing.free) || event.pricing.free;
        event.pricing.advanced = parseFloat(req.body.pricing.advanced) || event.pricing.advanced;
        event.pricing.pro = parseFloat(req.body.pricing.pro) || event.pricing.pro;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.deleteOne();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Register for an event and send email
router.post('/:id/register', async (req, res) => {
    const { email, pricingOption } = req.body;
    
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Create a transporter using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Create email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Registration Confirmation for ${event.name}`,
            text: `Thank you for registering for the event: ${event.name}.
            Here are the event details:
            - Date: ${event.date.toDateString()}
            - Location: ${event.location}
            - Pricing Option: ${pricingOption}
            
            Instructions:
            Please arrive 30 minutes before the event start time for registration. We look forward to seeing you!
            
            Regards,
            Eventus Team`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            }
            res.status(200).json({ message: 'Registration successful and email sent', info });
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
