CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE balance (
  id SERIAL PRIMARY KEY,
  balance_date DATE,
  balance_amount REAL
);

CREATE TABLE invoice (
  id SERIAL PRIMARY KEY,
  description TEXT,
  amount REAL,
  client TEXT,
  due_date DATE
);

CREATE TABLE bill (
  id SERIAL PRIMARY KEY,
  supplier TEXT,
  description TEXT,
  amount REAL,
  due_date DATE,
  category INTEGER REFERENCES category(id)
);

-- Seed categories
INSERT INTO category (id, name) VALUES
  (1, 'Rent/Office'),
  (2, 'Contractor'),
  (3, 'VAT/Tax'),
  (4, 'Payroll');
SELECT setval('category_id_seq', 4);

-- Seed balances
INSERT INTO balance (id, balance_date, balance_amount) VALUES
  (1, '2026-04-13', 325),
  (6, '2026-04-17', 61);
SELECT setval('balance_id_seq', 6);

-- Seed invoices
INSERT INTO invoice (id, description, amount, client, due_date) VALUES
  (1,  'Remaining 60%', 2511,    'Alkemy',      '2026-05-12'),
  (2,  'Remaining 60%', 6264.54, 'Landkey',     '2026-07-01'),
  (3,  'AI stuff',      3600,    'Brennan',     '2026-04-24'),
  (4,  'stuff',         270,     'Garlic wood', '2026-05-01'),
  (5,  'rent',          210,     'Gary',        '2026-05-01'),
  (6,  'rent',          210,     'Gary',        '2026-06-01'),
  (7,  'rent',          210,     'Gary',        '2026-07-01'),
  (8,  'rent',          206.4,   'Matt',        '2026-05-01'),
  (9,  'rent',          206.4,   'Matt',        '2026-06-01'),
  (10, 'rent',          206.4,   'Matt',        '2026-07-01');
SELECT setval('invoice_id_seq', 10);

-- Seed bills
INSERT INTO bill (id, supplier, description, amount, due_date, category) VALUES
  (1,  'Rent',        NULL,                 1800,    '2026-07-01', 1),
  (2,  'Georgia',     'Alkemy',             360,     '2026-04-20', 2),
  (3,  'Judith',      NULL,                 1000,    '2026-04-20', 2),
  (4,  'Freelancer',  'Projected Landkey',  1000,    '2026-06-01', 2),
  (5,  'Freelancer',  'Projected Landkey',  1000,    '2026-07-01', 2),
  (6,  'HMRC',        'VAT',                3423.57, '2026-06-07', 3),
  (7,  'Pay',         NULL,                 1800,    '2026-05-01', 4),
  (8,  'Pay',         NULL,                 1800,    '2026-06-01', 4),
  (9,  'Pay',         NULL,                 1800,    '2026-07-01', 4),
  (11, 'Accountancy', NULL,                 243,     '2026-05-15', 2),
  (12, 'Accountancy', NULL,                 243,     '2026-06-15', 2),
  (13, 'Accountancy', NULL,                 243,     '2026-07-15', 2);
SELECT setval('bill_id_seq', 13);
