const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/groupController');

// Get all groups
router.get('/', GroupController.getAllGroups);

// Get group by ID
router.get('/:id', GroupController.getGroupById);

// Create new group
router.post('/', GroupController.createGroup);

// Update group
router.put('/:id', GroupController.updateGroup);

// Delete group
router.delete('/:id', GroupController.deleteGroup);

// Get group members
router.get('/:id/members', GroupController.getGroupMembers);

// Add member to group
router.post('/:id/members', GroupController.addGroupMember);

// Remove member from group
router.delete('/:groupId/members/:personId', GroupController.removeGroupMember);

module.exports = router;