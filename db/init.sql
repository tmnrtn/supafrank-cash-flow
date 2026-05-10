CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE balance (
  id SERIAL PRIMARY KEY,
  balance_date DATE,
  balance_amount REAL
);

CREATE TABLE transaction (
  id SERIAL PRIMARY KEY,
  is_income BOOLEAN NOT NULL,
  counterparty TEXT,
  description TEXT,
  amount REAL NOT NULL,
  due_date DATE NOT NULL,
  category INTEGER REFERENCES category(id),
  project_id INTEGER REFERENCES project(id),
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence TEXT
);

-- Seed categories
INSERT INTO category (id, name) VALUES
  (1, 'Rent/Office'),
  (2, 'Contractor'),
  (3, 'VAT/Tax'),
  (4, 'Payroll');
SELECT setval('category_id_seq', 4);

-- Seed projects
INSERT INTO project (id, name) VALUES
  (1, 'Alkemy'),
  (2, 'Landkey');
SELECT setval('project_id_seq', 2);

-- Seed balances
INSERT INTO balance (id, balance_date, balance_amount) VALUES
  (1, '2026-04-13', 325),
  (6, '2026-04-17', 61);
SELECT setval('balance_id_seq', 6);

-- Seed transactions (migrated from invoice + bill)
INSERT INTO transaction (id, is_income, counterparty, description, amount, due_date, category, project_id, paid, recurrence) VALUES
  -- Income
  (1,  TRUE,  'Alkemy',      'Remaining 60%',     2511,    '2026-05-12', NULL, 1,    FALSE, NULL),
  (2,  TRUE,  'Landkey',     'Remaining 60%',     6264.54, '2026-07-01', NULL, 2,    FALSE, NULL),
  (3,  TRUE,  'Brennan',     'AI stuff',          3600,    '2026-04-24', NULL, NULL, FALSE, NULL),
  (4,  TRUE,  'Garlic wood', 'stuff',             270,     '2026-05-01', NULL, NULL, FALSE, NULL),
  (5,  TRUE,  'Gary',        'rent',              210,     '2026-05-01', NULL, NULL, FALSE, NULL),
  (6,  TRUE,  'Gary',        'rent',              210,     '2026-06-01', NULL, NULL, FALSE, NULL),
  (7,  TRUE,  'Gary',        'rent',              210,     '2026-07-01', NULL, NULL, FALSE, NULL),
  (8,  TRUE,  'Matt',        'rent',              206.4,   '2026-05-01', NULL, NULL, FALSE, NULL),
  (9,  TRUE,  'Matt',        'rent',              206.4,   '2026-06-01', NULL, NULL, FALSE, NULL),
  (10, TRUE,  'Matt',        'rent',              206.4,   '2026-07-01', NULL, NULL, FALSE, NULL),
  -- Expenses
  (11, FALSE, 'Rent',        NULL,                1800,    '2026-07-01', 1, NULL, FALSE, NULL),
  (12, FALSE, 'Georgia',     'Alkemy',            360,     '2026-04-20', 2, 1,    FALSE, NULL),
  (13, FALSE, 'Judith',      NULL,                1000,    '2026-04-20', 2, NULL, FALSE, NULL),
  (14, FALSE, 'Freelancer',  'Projected Landkey', 1000,    '2026-06-01', 2, 2,    FALSE, NULL),
  (15, FALSE, 'Freelancer',  'Projected Landkey', 1000,    '2026-07-01', 2, 2,    FALSE, NULL),
  (16, FALSE, 'HMRC',        'VAT',               3423.57, '2026-06-07', 3, NULL, FALSE, NULL),
  (17, FALSE, 'Pay',         NULL,                1800,    '2026-05-01', 4, NULL, FALSE, NULL),
  (18, FALSE, 'Pay',         NULL,                1800,    '2026-06-01', 4, NULL, FALSE, NULL),
  (19, FALSE, 'Pay',         NULL,                1800,    '2026-07-01', 4, NULL, FALSE, NULL),
  (20, FALSE, 'Accountancy', NULL,                243,     '2026-05-15', 2, NULL, FALSE, NULL),
  (21, FALSE, 'Accountancy', NULL,                243,     '2026-06-15', 2, NULL, FALSE, NULL),
  (22, FALSE, 'Accountancy', NULL,                243,     '2026-07-15', 2, NULL, FALSE, NULL);
SELECT setval('transaction_id_seq', 22);
