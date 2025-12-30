SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lastname VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    picture VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    startdate DATE,
    enddate DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS educations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    startdate DATE,
    enddate DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (lastname, firstname, email, phone, picture) 
VALUES ('NIANG', 'N\'BAYE', 'niangaffou@gmail.com', '0615897026', 'image_profil.png');
SET @user_id = LAST_INSERT_ID();

INSERT INTO experiences (user_id, name, description, startdate, enddate) VALUES 
(@user_id, 'Phone Sales (Retail)', 'Private, Ouagadougou, CT, Burkina Faso', '2023-10-01', '2025-06-30'),
(@user_id, 'File Operator', 'Bolloré Transport et logistique Burkina, Ouagadougou', '2022-04-01', '2022-09-30'),
(@user_id, 'Transport Coordinator', 'SDF International, Ouagadougou, CT, Burkina Faso', '2016-11-01', '2017-09-30');

INSERT INTO educations (user_id, name, description, startdate, enddate) VALUES 
(@user_id, 'BACHELOR OF COMPUTER SCIENCE', 'EPITECH Moulins', '2025-09-01', '2026-06-30'),
(@user_id, 'Third Year in T_
