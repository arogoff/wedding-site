const { pool } = require('../config/database');

class Event {
  // Get all events
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM events ORDER BY event_time');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single event by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new event
  static async create(eventData) {
    try {
      const { event_name, event_location, event_time, description } = eventData;
      const [result] = await pool.query(
        'INSERT INTO events (event_name, event_location, event_time, description) VALUES (?, ?, ?, ?)',
        [event_name, event_location, event_time, description]
      );
      return { 
        id: result.insertId, 
        event_name, 
        event_location, 
        event_time, 
        description 
      };
    } catch (error) {
      throw error;
    }
  }

  // Update an event
  static async update(id, eventData) {
    try {
      const { event_name, event_location, event_time, description } = eventData;
      await pool.query(
        'UPDATE events SET event_name = ?, event_location = ?, event_time = ?, description = ? WHERE id = ?',
        [event_name, event_location, event_time, description, id]
      );
      return { 
        id, 
        event_name, 
        event_location, 
        event_time, 
        description 
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete an event
  static async delete(id) {
    try {
      await pool.query('DELETE FROM events WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all people registered for an event
  static async getRegisteredPeople(eventId) {
    try {
      const [rows] = await pool.query(
        `SELECT p.* FROM people p
         JOIN people_registered_events pre ON p.id = pre.person_id
         WHERE pre.event_id = ?
         ORDER BY p.last_name, p.first_name`,
        [eventId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get count of registrations for an event
  static async getRegistrationCount(eventId) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM people_registered_events WHERE event_id = ?',
        [eventId]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Event;