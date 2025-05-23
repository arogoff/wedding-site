const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Person = require('../models/Person');

class GroupController {
  // Get all groups
  static async getAllGroups(req, res) {
    try {
      const groups = await Group.getAll();
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error getting all groups:', error);
      res.status(500).json({ message: 'Server error while fetching groups' });
    }
  }

  // Get group by ID
  static async getGroupById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const group = await Group.getById(id);
      
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      res.status(200).json(group);
    } catch (error) {
      console.error('Error getting group by ID:', error);
      res.status(500).json({ message: 'Server error while fetching group' });
    }
  }

  // Create new group
  static async createGroup(req, res) {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
      }
      
      const newGroup = await Group.create({ name, description: description || '' });
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ message: 'Server error while creating group' });
    }
  }

  // Update group
  static async updateGroup(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
      }
      
      // Check if group exists
      const existingGroup = await Group.getById(id);
      if (!existingGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      const updatedGroup = await Group.update(id, { 
        name, 
        description: description || existingGroup.description 
      });
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(500).json({ message: 'Server error while updating group' });
    }
  }

  // Delete group
  static async deleteGroup(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if group exists
      const existingGroup = await Group.getById(id);
      if (!existingGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      // Delete group members
      await GroupMember.deleteByGroupId(id);
      
      // Delete group
      await Group.delete(id);
      res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
      console.error('Error deleting group:', error);
      res.status(500).json({ message: 'Server error while deleting group' });
    }
  }

  // Get group members
  static async getGroupMembers(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if group exists
      const existingGroup = await Group.getById(id);
      if (!existingGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      const members = await Group.getMembers(id);
      res.status(200).json(members);
    } catch (error) {
      console.error('Error getting group members:', error);
      res.status(500).json({ message: 'Server error while fetching group members' });
    }
  }

  // Add member to group
  static async addGroupMember(req, res) {
    try {
      const groupId = parseInt(req.params.id);
      const { personId } = req.body;
      
      if (!personId) {
        return res.status(400).json({ message: 'Person ID is required' });
      }
      
      // Check if group exists
      const existingGroup = await Group.getById(groupId);
      if (!existingGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      // Check if person exists
      const existingPerson = await Person.getById(personId);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      const result = await Group.addMember(groupId, personId);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error adding group member:', error);
      res.status(500).json({ message: 'Server error while adding group member' });
    }
  }

  // Remove member from group
  static async removeGroupMember(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);
      const personId = parseInt(req.params.personId);
      
      // Check if group exists
      const existingGroup = await Group.getById(groupId);
      if (!existingGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      // Check if person exists
      const existingPerson = await Person.getById(personId);
      if (!existingPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      
      const result = await Group.removeMember(groupId, personId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error removing group member:', error);
      res.status(500).json({ message: 'Server error while removing group member' });
    }
  }
}

module.exports = GroupController;