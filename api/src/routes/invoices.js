const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM invoice ORDER BY due_date');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { client, description, amount, due_date } = req.body;
  const { rows } = await db.query(
    'INSERT INTO invoice (client, description, amount, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
    [client, description, amount, due_date]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { client, description, amount, due_date } = req.body;
  const { rows } = await db.query(
    'UPDATE invoice SET client = $1, description = $2, amount = $3, due_date = $4 WHERE id = $5 RETURNING *',
    [client, description, amount, due_date, req.params.id]
  );
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM invoice WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

module.exports = router;
