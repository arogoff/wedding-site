const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/personController');

// Get all people
router.get('/', PersonController.getAllPeople);

// Get person by ID
router.get('/:id', PersonController.getPersonById);

// Create new person
router.post('/', PersonController.createPerson);

// Update person
router.put('/:id', PersonController.updatePerson);

// Delete person
router.delete('/:id', PersonController.deletePerson);

// Get groups a person belongs to
router.get('/:id/groups', PersonController.getPersonGroups);

// Get events a person is registered for
router.get('/:id/events', PersonController.getPersonEvents);

module.exports = router;