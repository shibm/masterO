CREATE DATABASE IF NOT EXISTS employee_task_tracker;
USE employee_task_tracker;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  assigned_to INT NOT NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  details VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role)
VALUES
  ('Admin User', 'admin@example.com', '$2a$10$xJLNFc9mznmBkpWfafm0Ge7smO8kkRcD9hpZ.3aOQWiUpdR6tkUB6', 'admin'),
  ('Alice Employee', 'alice@example.com', '$2a$10$xJLNFc9mznmBkpWfafm0Ge7smO8kkRcD9hpZ.3aOQWiUpdR6tkUB6', 'employee'),
  ('Bob Employee', 'bob@example.com', '$2a$10$xJLNFc9mznmBkpWfafm0Ge7smO8kkRcD9hpZ.3aOQWiUpdR6tkUB6', 'employee')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role = VALUES(role);

INSERT INTO tasks (title, description, assigned_to, status, due_date)
VALUES
  ('Prepare onboarding checklist', 'Draft and verify the June onboarding checklist.', 2, 'pending', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
  ('Update CRM records', 'Clean up stale lead records before Friday.', 3, 'in_progress', DATE_ADD(CURDATE(), INTERVAL 5 DAY))
ON DUPLICATE KEY UPDATE title = VALUES(title);
