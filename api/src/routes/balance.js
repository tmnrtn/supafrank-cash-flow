const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM balance ORDER BY balance_date DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { balance_date, balance_amount } = req.body;
  const { rows } = await db.query(
    'INSERT INTO balance (balance_date, balance_amount) VALUES ($1, $2) RETURNING *',
    [balance_date, balance_amount]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { balance_date, balance_amount } = req.body;
  const { rows } = await db.query(
    'UPDATE balance SET balance_date = $1, balance_amount = $2 WHERE id = $3 RETURNING *',
    [balance_date, balance_amount, req.params.id]
  );
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM balance WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

module.exports = router;
