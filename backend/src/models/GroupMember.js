const { pool } = require('../config/database');

class GroupMember {
  // Get all group memberships
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT gm.id, gm.group_id, gm.person_id,
               p.first_name, p.last_name,
               g.name as group_name
        FROM group_members gm
        JOIN people p ON gm.person_id = p.id
        JOIN groups g ON gm.group_id = g.id
        ORDER BY g.name, p.last_name, p.first_name
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get group memberships by group ID
  static async getByGroupId(groupId) {
    try {
      const [rows] = await pool.query(`
        SELECT gm.id, gm.group_id, gm.person_id,
               p.first_name, p.last_name
        FROM group_members gm
        JOIN people p ON gm.person_id = p.id
        WHERE gm.group_id = ?
        ORDER BY p.last_name, p.first_name
      `, [groupId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get group memberships by person ID
  static async getByPersonId(personId) {
    try {
      const [rows] = await pool.query(`
        SELECT gm.id, gm.group_id, gm.person_id,
               g.name as group_name, g.description
        FROM group_members gm
        JOIN groups g ON gm.group_id = g.id
        WHERE gm.person_id = ?
        ORDER BY g.name
      `, [personId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create a group membership
  static async create(groupId, personId) {
    try {
      // Check if membership already exists
      const [exists] = await pool.query(
        'SELECT id FROM group_members WHERE group_id = ? AND person_id = ?',
        [groupId, personId]
      );
      
      if (exists.length > 0) {
        return { id: exists[0].id, message: 'Membership already exists' };
      }
      
      const [result] = await pool.query(
        'INSERT INTO group_members (group_id, person_id) VALUES (?, ?)',
        [groupId, personId]
      );
      
      return { 
        id: result.insertId,
        group_id: groupId,
        person_id: personId,
        message: 'Group membership created successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete a group membership
  static async delete(groupId, personId) {
    try {
      await pool.query(
        'DELETE FROM group_members WHERE group_id = ? AND person_id = ?',
        [groupId, personId]
      );
      return { message: 'Group membership deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Delete all memberships for a group
  static async deleteByGroupId(groupId) {
    try {
      await pool.query('DELETE FROM group_members WHERE group_id = ?', [groupId]);
      return { message: 'All memberships for this group deleted' };
    } catch (error) {
      throw error;
    }
  }

  // Delete all memberships for a person
  static async deleteByPersonId(personId) {
    try {
      await pool.query('DELETE FROM group_members WHERE person_id = ?', [personId]);
      return { message: 'All group memberships for this person deleted' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GroupMember;