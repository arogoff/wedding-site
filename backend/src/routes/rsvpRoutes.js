const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/rsvpController');

// Get all registrations
router.get('/', RegistrationController.getAllRegistrations);

// Register person for event
router.post('/', RegistrationController.registerPerson);

// Register person by name
router.post('/by-name', RegistrationController.registerPersonByName);

// Cancel registration
router.delete('/:eventId/:personId', RegistrationController.cancelRegistration);

router.post('/user', RegistrationController.getUserAndGroupInfo);
router.post('/update', RegistrationController.updateGroupRegistrations);

// Plus one routes (these must be ABOVE the parameterized route)
router.post('/plusone/add', RegistrationController.addPlusOne);
router.post('/plusone/remove', RegistrationController.removePlusOne);
router.get('/plusone/list', RegistrationController.getPlusOnes);

// Parameterized route LAST (only once!)
router.get('/:eventId/:personId', RegistrationController.checkRegistration);

module.exports = router;