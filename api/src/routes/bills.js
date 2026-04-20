const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query(`
    SELECT b.*, c.name AS category_name
    FROM bill b
    LEFT JOIN category c ON b.category = c.id
    ORDER BY b.due_date
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { supplier, description, amount, due_date, category } = req.body;
  const { rows } = await db.query(
    'INSERT INTO bill (supplier, description, amount, due_date, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [supplier, description, amount, due_date, category || null]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { supplier, description, amount, due_date, category } = req.body;
  const { rows } = await db.query(
    'UPDATE bill SET supplier = $1, description = $2, amount = $3, due_date = $4, category = $5 WHERE id = $6 RETURNING *',
    [supplier, description, amount, due_date, category || null, req.params.id]
  );
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM bill WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

module.exports = router;
