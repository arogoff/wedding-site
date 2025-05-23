const { pool } = require('../config/database');

class Registration {
    // Register a person for an event
    static async register(eventId, personId) {
        try {
            // Check if registration already exists
            const [exists] = await pool.query(
                'SELECT id FROM people_registered_events WHERE event_id = ? AND person_id = ?',
                [eventId, personId]
            );

            if (exists.length > 0) {
                return { message: 'Person is already registered for this event' };
            }

            const [result] = await pool.query(
                'INSERT INTO people_registered_events (event_id, person_id) VALUES (?, ?)',
                [eventId, personId]
            );

            return {
                id: result.insertId,
                event_id: eventId,
                person_id: personId,
                message: 'Registration successful'
            };
        } catch (error) {
            throw error;
        }
    }

    // Cancel a registration
    static async cancel(eventId, personId) {
        try {
            await pool.query(
                'DELETE FROM people_registered_events WHERE event_id = ? AND person_id = ?',
                [eventId, personId]
            );
            return { message: 'Registration cancelled successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Check if a person is registered for an event
    static async isRegistered(eventId, personId) {
        try {
            const [rows] = await pool.query(
                'SELECT id FROM people_registered_events WHERE event_id = ? AND person_id = ?',
                [eventId, personId]
            );
            return rows.length > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get all registrations
    static async getAll() {
        try {
            const [rows] = await pool.query(`
        SELECT pre.id, pre.event_id, pre.person_id, 
               p.first_name, p.last_name, 
               e.event_name, e.event_time
        FROM people_registered_events pre
        JOIN people p ON pre.person_id = p.id
        JOIN events e ON pre.event_id = e.id
        ORDER BY e.event_time, p.last_name, p.first_name
      `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Register by full name
    static async registerByName(eventId, firstName, lastName) {
        try {
            // Check if person exists
            const [person] = await pool.query(
                'SELECT id FROM people WHERE first_name = ? AND last_name = ?',
                [firstName, lastName]
            );

            if (person.length === 0) {
                // Create new person
                const [newPerson] = await pool.query(
                    'INSERT INTO people (first_name, last_name) VALUES (?, ?)',
                    [firstName, lastName]
                );

                // Register the new person
                return this.register(eventId, newPerson.insertId);
            }

            // Register existing person
            return this.register(eventId, person[0].id);
        } catch (error) {
            throw error;
        }
    }

    // Update group registrations
    static async updateGroupRegistrations(updatedRegistrations) {
        const results = [];
        for (const [eventId, members] of Object.entries(updatedRegistrations)) {
            for (const [memberName, shouldRegister] of Object.entries(members)) {
                const [firstName, ...rest] = memberName.split(" ");
                const lastName = rest.join(" ");
                // Find person
                const [people] = await pool.query(
                    "SELECT id FROM people WHERE first_name = ? AND last_name = ?",
                    [firstName, lastName]
                );
                if (!people.length) continue;
                const personId = people[0].id;

                // Check current registration
                const isRegistered = await this.isRegistered(eventId, personId);

                if (shouldRegister && !isRegistered) {
                    await this.register(eventId, personId);
                    results.push({ eventId, personId, action: "registered" });
                } else if (!shouldRegister && isRegistered) {
                    await this.cancel(eventId, personId);
                    results.push({ eventId, personId, action: "cancelled" });
                }
            }
        }
        return results;
    }

    // Get groups for a person
    static async getGroupsForPerson(personId) {
        const [groups] = await pool.query(
            `SELECT g.id, g.name FROM groups g
       JOIN group_members gm ON gm.group_id = g.id
       WHERE gm.person_id = ?`,
            [personId]
        );
        return groups;
    }

    // Get all group members for given group IDs
    static async getGroupMembers(groupIds) {
        if (!groupIds.length) return [];
        const [members] = await pool.query(
            `SELECT p.id, CONCAT(p.first_name, ' ', p.last_name) AS name
       FROM people p
       JOIN group_members gm ON gm.person_id = p.id
       WHERE gm.group_id IN (?)`,
            [groupIds]
        );
        return members;
    }

    // Get all events
    static async getAllEvents() {
        const [events] = await pool.query(
            'SELECT id, event_name, event_location, event_time, description FROM events'
        );
        return events;
    }

    static async countPlusOnes(inviterId) {
        const [[{ count }]] = await pool.query(
            "SELECT COUNT(*) as count FROM plus_ones WHERE inviter_person_id = ?",
            [inviterId]
        );
        return count;
    }

    static async addPlusOne(inviterId, firstName, lastName, groupIds = []) {
        // Insert person
        const [result] = await pool.query(
            "INSERT INTO people (first_name, last_name) VALUES (?, ?)",
            [firstName, lastName]
        );
        const newPersonId = result.insertId;

        // Add to group_members for each group
        for (const groupId of groupIds) {
            await pool.query(
                "INSERT INTO group_members (group_id, person_id) VALUES (?, ?)",
                [groupId, newPersonId]
            );
        }

        // Link in plus_ones table
        await pool.query(
            "INSERT INTO plus_ones (inviter_person_id, plus_one_person_id) VALUES (?, ?)",
            [inviterId, newPersonId]
        );

        return newPersonId;
    }

    static async removePlusOne(inviterId, plusOneId) {
        // Remove from plus_ones
        await pool.query(
            "DELETE FROM plus_ones WHERE inviter_person_id = ? AND plus_one_person_id = ?",
            [inviterId, plusOneId]
        );
        // Remove from all groups the inviter is in
        const [groups] = await pool.query(
            `SELECT group_id FROM group_members WHERE person_id = ?`,
            [inviterId]
        );
        for (const group of groups) {
            await pool.query(
                "DELETE FROM group_members WHERE group_id = ? AND person_id = ?",
                [group.group_id, plusOneId]
            );
        }
        // Optionally, also remove from people table
        await pool.query("DELETE FROM people WHERE id = ?", [plusOneId]);
    }
}

module.exports = Registration;