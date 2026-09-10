-- Default admin login: username=admin / password=Admin@123
-- IMPORTANT: change this password after first login in any real deployment

INSERT INTO roles (name) VALUES ('ADMIN'), ('TEACHER'), ('STUDENT'), ('GUEST');

INSERT INTO users (username, email, password_hash, is_active)
VALUES (
    'admin',
    'admin@smartclass.lk',
    '$2b$10$VsdSi8OLc1452t6meFPSq.lhDFGwkJcbR13uVrohy38z7l1/m5tsy',
    TRUE
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN';

INSERT INTO terms (name, start_date, end_date)
VALUES ('Term 3 2026', '2026-09-01', '2026-12-15');

INSERT INTO subjects (name, description) VALUES
    ('Mathematics', 'O/L and A/L Mathematics'),
    ('Science', 'O/L and A/L Combined Science'),
    ('English', 'Spoken and Written English');
