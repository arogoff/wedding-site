const Person = require('../models/Person');
const GroupMember = require('../models/GroupMember');

class PersonController {
  // Get all people
  static async getAllPeople(req, res) {
    try {
      const people = await Person.getAll();
      res.status(200).json(people);
    } catch (error) {
      console.error('Error getting all people:', error);
      res.status(500).json({ message: 'Server error while fetching people' });
    }
  }

  // Get person by ID
  static async getPersonById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const person = await Person.getById(id);
      
      if (!person) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      res.status(200).json(person);
    } catch (error) {
      console.error('Error getting person by ID:', error);
      res.status(500).json({ message: 'Server error while fetching person' });
    }
  }

  // Create new person
  static async createPerson(req, res) {
    try {
      const { first_name, last_name } = req.body;
      
      if (!first_name || !last_name) {
        return res.status(400).json({ message: 'First name and last name are required' });
      }
      
      const newPerson = await Person.create({ first_name, last_name });
      res.status(201).json(newPerson);
    } catch (error) {
      console.error('Error creating person:', error);
      res.status(500).json({ message: 'Server error while creating person' });
    }
  }

  // Update person
  static async updatePerson(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { first_name, last_name } = req.body;
      
      if (!first_name || !last_name) {
        return res.status(400).json({ message: 'First name and last name are required' });
      }
      
      // Check if person exists
      const existingPerson = await Person.getById(id);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      const updatedPerson = await Person.update(id, { first_name, last_name });
      res.status(200).json(updatedPerson);
    } catch (error) {
      console.error('Error updating person:', error);
      res.status(500).json({ message: 'Server error while updating person' });
    }
  }

  // Delete person
  static async deletePerson(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if person exists
      const existingPerson = await Person.getById(id);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      // Delete person's group memberships
      await GroupMember.deleteByPersonId(id);
      
      // Delete person
      await Person.delete(id);
      res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
      console.error('Error deleting person:', error);
      res.status(500).json({ message: 'Server error while deleting person' });
    }
  }

  // Get groups a person belongs to
  static async getPersonGroups(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if person exists
      const existingPerson = await Person.getById(id);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      const groups = await Person.getGroups(id);
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error getting person groups:', error);
      res.status(500).json({ message: 'Server error while fetching person groups' });
    }
  }

  // Get events a person is registered for
  static async getPersonEvents(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if person exists
      const existingPerson = await Person.getById(id);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      const events = await Person.getRegisteredEvents(id);
      res.status(200).json(events);
    } catch (error) {
      console.error('Error getting person events:', error);
      res.status(500).json({ message: 'Server error while fetching person events' });
    }
  }
}

module.exports = PersonController;