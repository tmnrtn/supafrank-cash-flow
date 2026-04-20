const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const balancesQuery = `
    WITH params AS (
      SELECT
        MAX(balance_date) AS start_date,
        (SELECT balance_amount FROM balance WHERE balance_date = (SELECT MAX(balance_date) FROM balance)) AS initial_balance
      FROM balance
    ),
    weeks AS (
      SELECT generate_series(1, 13) AS wk
    ),
    invoice_weekly AS (
      SELECT
        (due_date - params.start_date) / 7 + 1 AS wk,
        SUM(amount) AS total_in
      FROM invoice, params
      WHERE due_date >= params.start_date
        AND due_date <= params.start_date + 90
      GROUP BY 1
    ),
    bill_weekly AS (
      SELECT
        (due_date - params.start_date) / 7 + 1 AS wk,
        SUM(amount) AS total_out
      FROM bill, params
      WHERE due_date >= params.start_date
        AND due_date <= params.start_date + 90
      GROUP BY 1
    ),
    weekly_net AS (
      SELECT
        w.wk AS week_number,
        params.start_date + (w.wk * 7 - 1) AS week_end,
        COALESCE(iw.total_in, 0) - COALESCE(bw.total_out, 0) AS net_change
      FROM weeks w
      CROSS JOIN params
      LEFT JOIN invoice_weekly iw ON w.wk = iw.wk
      LEFT JOIN bill_weekly bw ON w.wk = bw.wk
    )
    SELECT
      wn.week_number,
      wn.week_end,
      params.initial_balance + COALESCE(
        SUM(wn.net_change) OVER (ORDER BY wn.week_number ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0
      ) AS start_balance,
      params.initial_balance + SUM(wn.net_change) OVER (ORDER BY wn.week_number) AS end_balance,
      wn.net_change
    FROM weekly_net wn
    CROSS JOIN params
    ORDER BY wn.week_number
  `;

  const receiptsQuery = `
    WITH params AS (
      SELECT MAX(balance_date) AS start_date FROM balance
    )
    SELECT
      (due_date - params.start_date) / 7 + 1 AS week_number,
      params.start_date + ((due_date - params.start_date) / 7 * 7 + 6) AS week_end,
      COALESCE(client, 'Other') AS name,
      SUM(amount) AS amount
    FROM invoice, params
    WHERE due_date >= params.start_date
      AND due_date <= params.start_date + 90
    GROUP BY 1, 2, 3
    ORDER BY 1, 3
  `;

  const paymentsQuery = `
    WITH params AS (
      SELECT MAX(balance_date) AS start_date FROM balance
    )
    SELECT
      (b.due_date - params.start_date) / 7 + 1 AS week_number,
      params.start_date + ((b.due_date - params.start_date) / 7 * 7 + 6) AS week_end,
      COALESCE(c.name, 'Other') AS name,
      SUM(b.amount) AS amount
    FROM bill b
    LEFT JOIN category c ON b.category = c.id
    CROSS JOIN params
    WHERE b.due_date >= params.start_date
      AND b.due_date <= params.start_date + 90
    GROUP BY 1, 2, 3
    ORDER BY 1, 3
  `;

  const [balances, receipts, payments] = await Promise.all([
    db.query(balancesQuery),
    db.query(receiptsQuery),
    db.query(paymentsQuery),
  ]);

  res.json({
    balances: balances.rows,
    receipts: receipts.rows,
    payments: payments.rows,
  });
});

module.exports = router;
