const Event = require('../models/Event');
const Person = require('../models/Person');

class EventController {
  // Get all events
  static async getAllEvents(req, res) {
    try {
      const events = await Event.getAll();
      res.status(200).json(events);
    } catch (error) {
      console.error('Error getting all events:', error);
      res.status(500).json({ message: 'Server error while fetching events' });
    }
  }

  // Get event by ID
  static async getEventById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const event = await Event.getById(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.status(200).json(event);
    } catch (error) {
      console.error('Error getting event by ID:', error);
      res.status(500).json({ message: 'Server error while fetching event' });
    }
  }

  // Create new event
  static async createEvent(req, res) {
    try {
      const { event_name, event_location, event_time, description } = req.body;
      
      if (!event_name || !event_location || !event_time) {
        return res.status(400).json({ 
          message: 'Event name, location, and time are required' 
        });
      }
      
      // Validate date format
      const dateObj = new Date(event_time);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format for event time' });
      }
      
      const newEvent = await Event.create({ 
        event_name, 
        event_location, 
        event_time, 
        description: description || '' 
      });
      
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Server error while creating event' });
    }
  }

  // Update event
  static async updateEvent(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { event_name, event_location, event_time, description } = req.body;
      
      if (!event_name || !event_location || !event_time) {
        return res.status(400).json({ 
          message: 'Event name, location, and time are required' 
        });
      }
      
      // Validate date format
      const dateObj = new Date(event_time);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format for event time' });
      }
      
      // Check if event exists
      const existingEvent = await Event.getById(id);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const updatedEvent = await Event.update(id, { 
        event_name, 
        event_location, 
        event_time, 
        description: description || existingEvent.description 
      });
      
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Server error while updating event' });
    }
  }

  // Delete event
  static async deleteEvent(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if event exists
      const existingEvent = await Event.getById(id);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      await Event.delete(id);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Server error while deleting event' });
    }
  }

  // Get registered people for an event
  static async getEventRegistrations(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if event exists
      const existingEvent = await Event.getById(id);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const registrations = await Event.getRegisteredPeople(id);
      res.status(200).json(registrations);
    } catch (error) {
      console.error('Error getting event registrations:', error);
      res.status(500).json({ message: 'Server error while fetching event registrations' });
    }
  }

  // Get registration count for an event
  static async getEventRegistrationCount(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if event exists
      const existingEvent = await Event.getById(id);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const count = await Event.getRegistrationCount(id);
      res.status(200).json({ event_id: id, registration_count: count });
    } catch (error) {
      console.error('Error getting event registration count:', error);
      res.status(500).json({ message: 'Server error while fetching registration count' });
    }
  }
}

module.exports = EventController;