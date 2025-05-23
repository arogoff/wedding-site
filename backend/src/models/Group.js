const { pool } = require('../config/database');

class Group {
  // Get all groups
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM groups ORDER BY name');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single group by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM groups WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new group
  static async create(groupData) {
    try {
      const { name, description } = groupData;
      const [result] = await pool.query(
        'INSERT INTO groups (name, description) VALUES (?, ?)',
        [name, description]
      );
      return { id: result.insertId, name, description };
    } catch (error) {
      throw error;
    }
  }

  // Update a group
  static async update(id, groupData) {
    try {
      const { name, description } = groupData;
      await pool.query(
        'UPDATE groups SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      return { id, name, description };
    } catch (error) {
      throw error;
    }
  }

  // Delete a group
  static async delete(id) {
    try {
      await pool.query('DELETE FROM groups WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all members of a group
  static async getMembers(groupId) {
    try {
      const [rows] = await pool.query(
        `SELECT p.* FROM people p
         JOIN group_members gm ON p.id = gm.person_id
         WHERE gm.group_id = ?
         ORDER BY p.last_name, p.first_name`,
        [groupId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Add a person to a group
  static async addMember(groupId, personId) {
    try {
      // Check if membership already exists
      const [exists] = await pool.query(
        'SELECT id FROM group_members WHERE group_id = ? AND person_id = ?',
        [groupId, personId]
      );
      
      if (exists.length > 0) {
        return { message: 'Person is already a member of this group' };
      }
      
      await pool.query(
        'INSERT INTO group_members (group_id, person_id) VALUES (?, ?)',
        [groupId, personId]
      );
      return { message: 'Person added to group successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Remove a person from a group
  static async removeMember(groupId, personId) {
    try {
      await pool.query(
        'DELETE FROM group_members WHERE group_id = ? AND person_id = ?',
        [groupId, personId]
      );
      return { message: 'Person removed from group successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Group;