-- Create the database
CREATE DATABASE IF NOT EXISTS rsvp_system;
USE rsvp_system;

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS people_registered_events;
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS people;

-- Create people table
CREATE TABLE people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    INDEX idx_people_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create groups table
CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    INDEX idx_group_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create group_members table for mapping people to groups (many-to-many relationship)
CREATE TABLE group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    person_id INT NOT NULL,
    UNIQUE KEY unique_group_person (group_id, person_id),
    CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_members_person FOREIGN KEY (person_id) REFERENCES people (id) ON DELETE CASCADE,
    INDEX idx_group_members_group (group_id),
    INDEX idx_group_members_person (person_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_time DATETIME NOT NULL,
    description TEXT,
    INDEX idx_event_time (event_time),
    INDEX idx_event_name (event_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create people_registered_events table
CREATE TABLE people_registered_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    person_id INT NOT NULL,
    UNIQUE KEY unique_person_event (person_id, event_id),
    CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_registrations_person FOREIGN KEY (person_id) REFERENCES people (id) ON DELETE CASCADE,
    INDEX idx_registrations_event (event_id),
    INDEX idx_registrations_person (person_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE plus_ones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inviter_person_id INT NOT NULL, -- the main guest who invited
  plus_one_person_id INT NOT NULL, -- the plus one person
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inviter_person_id) REFERENCES people(id),
  FOREIGN KEY (plus_one_person_id) REFERENCES people(id)
);

-- Insert sample data for testing
-- Sample people
INSERT INTO people (first_name, last_name) VALUES 
('John', 'Doe'),
('Jane', 'Smith'),
('Robert', 'Johnson'),
('Emily', 'Williams'),
('Michael', 'Brown');

-- Sample groups
INSERT INTO groups (name, description) VALUES 
('Family', 'Family members and relatives'),
('Friends', 'Close friends'),
('Colleagues', 'Work colleagues and professional connections'),
('VIP', 'Very important people');

-- Sample group memberships
INSERT INTO group_members (group_id, person_id) VALUES 
(1, 1), -- John in Family
(1, 2), -- Jane in Family
(2, 3), -- Robert in Friends
(2, 4), -- Emily in Friends
(3, 5), -- Michael in Colleagues
(3, 1), -- John in Colleagues
(4, 2); -- Jane in VIP

-- Sample events
INSERT INTO events (event_name, event_location, event_time, description) VALUES 
('Summer Party', 'Central Park', '2025-06-15 18:00:00', 'Annual summer celebration'),
('Conference', 'Grand Hotel', '2025-07-10 09:00:00', 'Industry conference'),
('Workshop', 'Community Center', '2025-08-05 14:00:00', 'Skills workshop');

-- Sample registrations
INSERT INTO people_registered_events (event_id, person_id) VALUES 
(1, 1), -- John registered for Summer Party
(1, 2), -- Jane registered for Summer Party
(2, 3), -- Robert registered for Conference
(2, 4), -- Emily registered for Conference
(3, 5); -- Michael registered for Workshop