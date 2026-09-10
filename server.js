require('dotenv').config();
const express = require('express');
const path = require('path');

const menuRouter = require('./routes/menu');
const bookingsRouter = require('./routes/bookings');
const ordersRouter = require('./routes/orders');
const { requireAdminKey } = require('./utils/adminAuth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Public-facing menu API
app.use('/api/menu', menuRouter);

// Booking system (table reservations) — separate from ordering
app.use('/api/bookings', (req, res, next) => {
  // Only status-changing requests need the admin key; anyone can create a booking.
  if (req.method === 'PATCH') return requireAdminKey(req, res, next);
  if (req.method === 'GET') return requireAdminKey(req, res, next); // booking list is admin-only
  next();
}, bookingsRouter);

// Ordering system (food delivery) — separate from booking
app.use('/api/orders', (req, res, next) => {
  if (req.method === 'PATCH') return requireAdminKey(req, res, next);
  if (req.method === 'GET') return requireAdminKey(req, res, next); // order list is admin-only
  next();
}, ordersRouter);

app.listen(PORT, () => {
  console.log(`Hotel Kanha Resort And Restaurant server running on http://localhost:${PORT}`);
});
