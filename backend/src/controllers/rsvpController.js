const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Person = require('../models/Person');
const { pool } = require('../config/database');

class RegistrationController {
  // Get all registrations
  static async getAllRegistrations(req, res) {
    try {
      const registrations = await Registration.getAll();
      res.status(200).json(registrations);
    } catch (error) {
      console.error('Error getting all registrations:', error);
      res.status(500).json({ message: 'Server error while fetching registrations' });
    }
  }

  // Register person for event
  static async registerPerson(req, res) {
    try {
      const { eventId, personId } = req.body;
      
      if (!eventId || !personId) {
        return res.status(400).json({ message: 'Event ID and Person ID are required' });
      }
      
      // Check if event exists
      const existingEvent = await Event.getById(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if person exists
      const existingPerson = await Person.getById(personId);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      const result = await Registration.register(eventId, personId);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error registering person for event:', error);
      res.status(500).json({ message: 'Server error while registering for event' });
    }
  }

  // Register person by name
  static async registerPersonByName(req, res) {
    try {
      const { eventId, firstName, lastName } = req.body;
      
      if (!eventId || !firstName || !lastName) {
        return res.status(400).json({ 
          message: 'Event ID, first name, and last name are required' 
        });
      }
      
      // Check if event exists
      const existingEvent = await Event.getById(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const result = await Registration.registerByName(eventId, firstName, lastName);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error registering person by name:', error);
      res.status(500).json({ message: 'Server error while registering for event' });
    }
  }

  // Cancel registration
  static async cancelRegistration(req, res) {
    try {
      const eventId = parseInt(req.params.eventId);
      const personId = parseInt(req.params.personId);
      
      // Check if event exists
      const existingEvent = await Event.getById(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if person exists
      const existingPerson = await Person.getById(personId);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      // Check if registration exists
      const isRegistered = await Registration.isRegistered(eventId, personId);
      if (!isRegistered) {
        return res.status(404).json({ message: 'Registration not found' });
      }
      
      const result = await Registration.cancel(eventId, personId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error canceling registration:', error);
      res.status(500).json({ message: 'Server error while canceling registration' });
    }
  }

  // Check if person is registered for event
  static async checkRegistration(req, res) {
    try {
      const eventId = Number(req.params.eventId);
      const personId = Number(req.params.personId);
      
      if (isNaN(eventId) || isNaN(personId)) {
        return res.status(400).json({ message: 'Invalid event ID or person ID' });
      }
      
      // Check if event exists
      const existingEvent = await Event.getById(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if person exists
      const existingPerson = await Person.getById(personId);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      const isRegistered = await Registration.isRegistered(eventId, personId);
      res.status(200).json({ 
        event_id: eventId, 
        person_id: personId, 
        is_registered: isRegistered 
      });
    } catch (error) {
      console.error('Error checking registration:', error);
      res.status(500).json({ message: 'Server error while checking registration' });
    }
  }

  static async getUserAndGroupInfo(req, res) {
    try {
      const { fullName } = req.body;
      if (!fullName) return res.status(400).json({ error: 'Full name required' });

      // 1. Find the person
      const user = await Person.findByFullName(fullName);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // 2. Find groups the user belongs to
      const groups = await Registration.getGroupsForPerson(user.id);

      // 3. Find all group members (including the user)
      let groupMembers = [];
      if (groups.length) {
        const groupIds = groups.map(g => g.id);
        groupMembers = await Registration.getGroupMembers(groupIds);
      } else {
        groupMembers = [{ id: user.id, name: `${user.first_name} ${user.last_name}` }];
      }

      // 4. Get all events
      const events = await Registration.getAllEvents();

      // 5. For each group member, check registration for each event
      const groupMembersWithEvents = await Promise.all(
        groupMembers.map(async (member) => {
          const eventsWithStatus = await Promise.all(
            events.map(async (event) => {
              const isRegistered = await Registration.isRegistered(event.id, member.id);
              return {
                id: event.id,
                name: event.event_name,
                location: event.event_location,
                event_time: event.event_time,
                description: event.description,
                registered: isRegistered
              };
            })
          );
          return {
            name: member.name,
            events: eventsWithStatus
          };
        })
      );

      // 6. Format response
      res.json({
        user: { 
          id: user.id,
          name: `${user.first_name} ${user.last_name}`, 
          email: user.email,
          plus_ones_allowed: user.plus_ones_allowed
        },
        groups: groups.map(g => ({ name: g.name })),
        groupMembers: groupMembersWithEvents
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Update group registrations
  static async updateGroupRegistrations(req, res) {
    try {
      const { updatedRegistrations, plusOnes, inviterId } = req.body;
      if (!updatedRegistrations) {
        return res.status(400).json({ message: "No registration data provided" });
      }
      await Registration.updateGroupRegistrations(updatedRegistrations);

      // Add plus ones
      if (plusOnes && Array.isArray(plusOnes) && inviterId) {
        // Get inviter's group(s) using the model
        const groups = await Registration.getGroupsForPerson(inviterId);
        const groupIds = groups.map(g => g.id);

        for (const plusOne of plusOnes) {
          const fullName = typeof plusOne === "string" ? plusOne : plusOne.name;
          if (!fullName) continue;
          const [firstName, ...rest] = fullName.trim().split(" ");
          const lastName = rest.join(" ");
          // Use the model to add the plus one and associate with group(s)
          await Registration.addPlusOne(inviterId, firstName, lastName, groupIds);
        }
      }

      res.json({ message: "Registrations updated successfully" });
    } catch (error) {
      console.error("Error updating registrations:", error);
      res.status(500).json({ message: "Server error while updating registrations" });
    }
  }

  // Add a plus one
  static async addPlusOne(req, res) {
    try {
      const { inviterId, fullName } = req.body;
      if (!inviterId || !fullName) return res.status(400).json({ message: "Missing data" });

      // Check limit
      const inviter = await Person.getById(inviterId);
      const allowed = inviter.plus_ones_allowed || 0;
      const current = await Registration.countPlusOnes(inviterId);
      if (current >= allowed) {
        return res.status(400).json({ message: "Plus one limit reached" });
      }

      // Get inviter's group(s)
      const groups = await Registration.getGroupsForPerson(inviterId);
      const groupIds = groups.map(g => g.id);

      const [firstName, ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ");
      const plusOneId = await Registration.addPlusOne(inviterId, firstName, lastName, groupIds);

      res.json({ plusOneId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error adding plus one" });
    }
  }

  // Remove a plus one
  static async removePlusOne(req, res) {
    try {
      const { inviterId, plusOneId } = req.body;
      if (!inviterId || !plusOneId) return res.status(400).json({ message: "Missing data" });

      await Registration.removePlusOne(inviterId, plusOneId);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error removing plus one" });
    }
  }

  // Get plus ones for a user
  static async getPlusOnes(req, res) {
    try {
      const { inviterId } = req.query;
    // Validate inviterId
    if (inviterId === undefined || inviterId === null || isNaN(Number(inviterId))) {
      return res.status(400).json({ message: 'Invalid inviter ID' });
    }

    // Get plus ones from database
    const plusOnes = await Person.getPlusOnes(Number(inviterId));
    if (!plusOnes) {
      return res.status(200).json({ plusOnes: [] });
    }
    return res.status(200).json({ plusOnes });
  } catch (err) {
    console.error('Error fetching plus ones:', err);
    return res.status(500).json({ message: 'Server error while fetching plus ones' });
  }
  }

  // Handle add plus one from client
  static async handleAddPlusOne(req, res) {
    try {
      const { inviterId, fullName } = req.body;
      if (!inviterId || !fullName) return res.status(400).json({ message: "Missing data" });

      // Check limit
      const inviter = await Person.getById(inviterId);
      const allowed = inviter.plus_ones_allowed || 0;
      const current = await Registration.countPlusOnes(inviterId);
      if (current >= allowed) {
        return res.status(400).json({ message: "Plus one limit reached" });
      }

      const [firstName, ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ");
      const plusOneId = await Registration.addPlusOne(inviterId, firstName, lastName);

      res.json({ plusOneId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error adding plus one" });
    }
  }
}

module.exports = RegistrationController;