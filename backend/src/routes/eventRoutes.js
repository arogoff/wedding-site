const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');

// Get all events
router.get('/', EventController.getAllEvents);

// Get event by ID
router.get('/:id', EventController.getEventById);

// Create new event
router.post('/', EventController.createEvent);

// Update event
router.put('/:id', EventController.updateEvent);

// Delete event
router.delete('/:id', EventController.deleteEvent);

// Get registered people for an event
router.get('/:id/registrations', EventController.getEventRegistrations);

// Get registration count for an event
router.get('/:id/registration-count', EventController.getEventRegistrationCount);

module.exports = router;