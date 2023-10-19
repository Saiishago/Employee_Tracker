INSERT INTO department (department_name)
VALUES 
('Executive Board'),
('Security'),
('Human Resources'),
('Finance'),
('Information Technology'),
('Marketing'),
('Sales'),
('Customer Relations'),
('Health and Sanitation');

INSERT INTO role (title, salary, department_id)
VALUES 
('Chief Executive Officer', 600000.00, 1),
('Security Director', 100000.00, 2),
('HR Manager', 190000.00, 3),
('Finance Director', 150000.00, 4),
('IT Director', 155000.00, 5),
('Marketing Director', 150000.00, 6),
('Sales Head', 160000.00, 7),
('Customer Relations Director', 120000.00, 8),
('Health and Sanitation Director', 130000.00, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Sello', 'Mphago', 1, 1),
('Obakeng', 'Mothowa', 2, 2),
('Tsholofelo', 'Ramatlhware', 3, 3),
('Tshegofatso', 'Malungani', 4, 4),
('Teboho', 'Molusi', 5, 5),
('Salome', 'Mphago', 6, 6),
('Grant', 'Davis', 7, 7),
('Malebo', 'Makgale', 8, 8),
('Amogelang', 'Makgale', 9, 9);