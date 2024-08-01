-- Insert sample departments
INSERT INTO departments (name) VALUES 
('Litigation'), 
('Corporate Law'), 
('Family Law'), 
('Intellectual Property');

-- Insert sample roles
INSERT INTO roles (title, salary, department_id) VALUES 
('Senior Attorney', 120000, (SELECT id FROM departments WHERE name = 'Litigation')),
('Junior Attorney', 80000, (SELECT id FROM departments WHERE name = 'Litigation')),
('Paralegal', 60000, (SELECT id FROM departments WHERE name = 'Corporate Law')),
('Legal Assistant', 50000, (SELECT id FROM departments WHERE name = 'Family Law'));

-- Insert sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('Cool', 'Guy', (SELECT id FROM roles WHERE title = 'Senior Attorney'), NULL),
('Cool', 'Gal', (SELECT id FROM roles WHERE title = 'Junior Attorney'), (SELECT id FROM employees WHERE first_name = 'John' AND last_name = 'Doe')),
('Example', 'Employee', (SELECT id FROM roles WHERE title = 'Paralegal'), NULL),
('Best', 'Assistant', (SELECT id FROM roles WHERE title = 'Legal Assistant'), NULL);

-- Insert sample clients
INSERT INTO clients (name, contact_info) VALUES 
('BST Corp', 'contact@bst.com'),
('Aneeda Helper', 'aneeda.helper@example.com');

-- Insert sample cases
INSERT INTO cases (case_number, case_name, status, assigned_to) VALUES 
('12345', 'wecode4free vs. UTbootcamp Co.', 'Open', (SELECT id FROM employees WHERE first_name = 'Cool' AND last_name = 'Guy')),
('67890', 'Code Compensation', 'Closed', (SELECT id FROM employees WHERE first_name = 'Cool' AND last_name = 'Gal'));

-- Insert sample client-cases associations
INSERT INTO client_cases (client_id, case_id) VALUES 
((SELECT id FROM clients WHERE name = 'BST Corp'), (SELECT id FROM cases WHERE case_number = '12345')),
((SELECT id FROM clients WHERE name = 'Aneeda Helper'), (SELECT id FROM cases WHERE case_number = '67890'));
