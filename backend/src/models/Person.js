const { pool } = require('../config/database');

class Person {
  // Get all people
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM people ORDER BY last_name, first_name');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single person by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM people WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get person by full name (first name + last name)
  static async getByFullName(firstName, lastName) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM people WHERE first_name = ? AND last_name = ?', 
        [firstName, lastName]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByFullName(fullName) {
    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ');
    const [rows] = await pool.query(
      'SELECT * FROM people WHERE first_name = ? AND last_name = ?',
      [firstName, lastName]
    );
    return rows[0] || null;
  }

  // Create a new person
  static async create(personData) {
    try {
      const { first_name, last_name } = personData;
      const [result] = await pool.query(
        'INSERT INTO people (first_name, last_name) VALUES (?, ?)',
        [first_name, last_name]
      );
      return { id: result.insertId, first_name, last_name };
    } catch (error) {
      throw error;
    }
  }

  // Update a person
  static async update(id, personData) {
    try {
      const { first_name, last_name } = personData;
      await pool.query(
        'UPDATE people SET first_name = ?, last_name = ? WHERE id = ?',
        [first_name, last_name, id]
      );
      return { id, first_name, last_name };
    } catch (error) {
      throw error;
    }
  }

  // Delete a person
  static async delete(id) {
    try {
      await pool.query('DELETE FROM people WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all groups a person belongs to
  static async getGroups(personId) {
    try {
      const [rows] = await pool.query(
        `SELECT g.* FROM groups g
         JOIN group_members gm ON g.id = gm.group_id
         WHERE gm.person_id = ?`,
        [personId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all events a person is registered for
  static async getRegisteredEvents(personId) {
    try {
      const [rows] = await pool.query(
        `SELECT e.* FROM events e
         JOIN people_registered_events pre ON e.id = pre.event_id
         WHERE pre.person_id = ?`,
        [personId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPlusOnes(inviterId) {
    try {
      // First check if the inviter exists
      const [inviter] = await pool.query(
        'SELECT id FROM people WHERE id = ?',
        [inviterId]
      );

      if (!inviter.length) {
        return null;
      }

      const [rows] = await pool.query(
        `SELECT p.id, p.first_name, p.last_name 
         FROM plus_ones po
         JOIN people p ON po.plus_one_person_id = p.id
         WHERE po.inviter_person_id = ?`,
        [inviterId]
      );
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch plus ones');
    }
  }
}

module.exports = Person;