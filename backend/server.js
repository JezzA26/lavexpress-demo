const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'lavexpress-super-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'lavexpress.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Database connected:', dbPath);
    initDatabase();
  }
});

// Helper para promisificar sqlite3
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initialize database tables
async function initDatabase() {
  try {
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        icon TEXT,
        base_price REAL NOT NULL,
        unit TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        order_number TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'pendiente',
        pickup_address TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        pickup_date TEXT NOT NULL,
        pickup_time TEXT NOT NULL,
        delivery_date TEXT NOT NULL,
        total_price REAL NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Order items table (servicios en cada pedido)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        quantity REAL NOT NULL,
        unit_price REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(service_id) REFERENCES services(id)
      )
    `);

    // Insert default services if empty
    const servicesCount = await dbGet('SELECT COUNT(*) as count FROM services');
    if (servicesCount.count === 0) {
      const services = [
        { name: 'Lavado', icon: '🫧', base_price: 35, unit: 'kg', description: 'Lavado y secado básico' },
        { name: 'Secado', icon: '💨', base_price: 25, unit: 'kg', description: 'Solo secado de ropa' },
        { name: 'Planchado', icon: '👔', base_price: 15, unit: 'pieza', description: 'Planchado profesional' },
        { name: 'Doblado', icon: '🗂️', base_price: 10, unit: 'kg', description: 'Doblado y organización' }
      ];

      for (const service of services) {
        await dbRun(
          'INSERT INTO services (name, icon, base_price, unit, description) VALUES (?, ?, ?, ?, ?)',
          [service.name, service.icon, service.base_price, service.unit, service.description]
        );
      }
      console.log('✅ Default services created');
    }

    // Insert demo user if empty
    const usersCount = await dbGet('SELECT COUNT(*) as count FROM users');
    if (usersCount.count === 0) {
      const hashedPassword = bcryptjs.hashSync('demo123', 10);
      await dbRun(
        'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
        ['Ajezz Demo', 'ajezz@demo.local', hashedPassword, '+52 123 456 7890', 'Veracruz, Ver.']
      );
      console.log('✅ Demo user created (email: ajezz@demo.local, password: demo123)');
    }

  } catch (error) {
    console.error('Database init error:', error);
  }
}

// === AUTH ROUTES ===

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password required' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const result = await dbRun(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, address || null]
    );

    const user = await dbGet('SELECT id, name, email, phone, address FROM users WHERE id = ?', [result.lastID]);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'User registered', user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isValid = bcryptjs.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    res.json({ message: 'Login successful', user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === MIDDLEWARE: Verify JWT ===
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// === SERVICES ROUTES ===

// Get all services
app.get('/services', async (req, res) => {
  try {
    const services = await dbAll('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === ORDERS ROUTES ===

// Create order
app.post('/orders', verifyToken, async (req, res) => {
  try {
    const { pickup_address, delivery_address, pickup_date, pickup_time, delivery_date, items, notes } = req.body;

    if (!pickup_address || !delivery_address || !pickup_date || !pickup_time || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const service = await dbGet('SELECT base_price FROM services WHERE id = ?', [item.service_id]);
      const subtotal = service.base_price * item.quantity;
      total += subtotal;
    }

    // Generate order number
    const orderNumber = `LV-${Date.now()}`;

    // Create order
    const orderResult = await dbRun(
      `INSERT INTO orders (user_id, order_number, pickup_address, delivery_address, pickup_date, pickup_time, delivery_date, total_price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, orderNumber, pickup_address, delivery_address, pickup_date, pickup_time, delivery_date, total, notes || null]
    );

    const orderId = orderResult.lastID;

    // Add order items
    for (const item of items) {
      const service = await dbGet('SELECT base_price FROM services WHERE id = ?', [item.service_id]);
      const subtotal = service.base_price * item.quantity;

      await dbRun(
        'INSERT INTO order_items (order_id, service_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.service_id, item.quantity, service.base_price, subtotal]
      );
    }

    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [orderId]);
    const orderItems = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    res.json({ message: 'Order created', order, items: orderItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
app.get('/orders', verifyToken, async (req, res) => {
  try {
    const orders = await dbAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order details
app.get('/orders/:id', verifyToken, async (req, res) => {
  try {
    const order = await dbGet('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await dbAll('SELECT oi.*, s.name, s.icon FROM order_items oi JOIN services s ON oi.service_id = s.id WHERE oi.order_id = ?', [req.params.id]);

    res.json({ order, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin)
app.patch('/orders/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status required' });
    }

    await dbRun('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [status, req.params.id, req.userId]);

    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === USER ROUTE ===

// Get current user
app.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, phone, address FROM users WHERE id = ?', [req.userId]);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/user', verifyToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await dbRun('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?', [name, phone, address, req.userId]);

    const user = await dbGet('SELECT id, name, email, phone, address FROM users WHERE id = ?', [req.userId]);
    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`\n🚀 LavExpress Backend running on http://localhost:${PORT}`);
  console.log(`📡 Demo User: ajezz@demo.local / demo123\n`);
});
