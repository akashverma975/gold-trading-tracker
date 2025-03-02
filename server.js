const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
let db;
async function setupDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ornament_type TEXT NOT NULL,
      weight REAL NOT NULL,
      purity TEXT NOT NULL,
      margin REAL NOT NULL,
      rate_per_gram REAL NOT NULL,
      transaction_date TEXT NOT NULL,
      retailer TEXT NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      payment_due_date TEXT,
      notes TEXT
    )
  `);

  console.log('Database initialized');
}

// API Routes
// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await db.all('SELECT * FROM transactions ORDER BY transaction_date DESC');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single transaction
app.get('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const {
      ornament_type,
      weight,
      purity,
      margin,
      rate_per_gram,
      transaction_date,
      retailer,
      payment_status,
      payment_due_date,
      notes
    } = req.body;

    const result = await db.run(
      `INSERT INTO transactions 
       (ornament_type, weight, purity, margin, rate_per_gram, transaction_date, retailer, payment_status, payment_due_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ornament_type, weight, purity, margin, rate_per_gram, transaction_date, retailer, payment_status || 'pending', payment_due_date, notes]
    );

    const newTransaction = await db.get('SELECT * FROM transactions WHERE id = ?', result.lastID);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const {
      ornament_type,
      weight,
      purity,
      margin,
      rate_per_gram,
      transaction_date,
      retailer,
      payment_status,
      payment_due_date,
      notes
    } = req.body;

    await db.run(
      `UPDATE transactions 
       SET ornament_type = ?, weight = ?, purity = ?, margin = ?, rate_per_gram = ?, 
           transaction_date = ?, retailer = ?, payment_status = ?, payment_due_date = ?, notes = ?
       WHERE id = ?`,
      [ornament_type, weight, purity, margin, rate_per_gram, transaction_date, retailer, 
       payment_status, payment_due_date, notes, req.params.id]
    );

    const updatedTransaction = await db.get('SELECT * FROM transactions WHERE id = ?', req.params.id);
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const result = await db.run('DELETE FROM transactions WHERE id = ?', req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search transactions
app.get('/api/search', async (req, res) => {
  try {
    const { query, startDate, endDate, ornamentType, retailer, paymentStatus } = req.query;
    
    let sql = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (query) {
      sql += ' AND (ornament_type LIKE ? OR retailer LIKE ? OR notes LIKE ?)';
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (startDate && endDate) {
      sql += ' AND transaction_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      sql += ' AND transaction_date >= ?';
      params.push(startDate);
    } else if (endDate) {
      sql += ' AND transaction_date <= ?';
      params.push(endDate);
    }

    if (ornamentType) {
      sql += ' AND ornament_type = ?';
      params.push(ornamentType);
    }

    if (retailer) {
      sql += ' AND retailer = ?';
      params.push(retailer);
    }

    if (paymentStatus) {
      sql += ' AND payment_status = ?';
      params.push(paymentStatus);
    }

    sql += ' ORDER BY transaction_date DESC';

    const transactions = await db.all(sql, params);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment reminders
app.get('/api/reminders', async (req, res) => {
  try {
    const reminders = await db.all(`
      SELECT * FROM transactions 
      WHERE payment_status = 'pending' 
      AND payment_due_date IS NOT NULL 
      ORDER BY payment_due_date ASC
    `);
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  await setupDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
