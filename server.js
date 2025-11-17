require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./backend/config/db');
const { attachUser } = require('./backend/middleware/auth');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// View engine setup (Handlebars)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register Handlebars helpers
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Custom Handlebars helpers
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

hbs.registerHelper('substring', function(str, start, end) {
  if (!str) return '';
  return str.substring(start, end).toUpperCase();
});

hbs.registerHelper('formatDate', function(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

hbs.registerHelper('timeAgo', function(date) {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [name, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${name} ago` : `${interval} ${name}s ago`;
    }
  }
  return 'just now';
});

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // Update session once per day
  }),
  cookie: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 2592000000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Attach user to all views
app.use(attachUser);

// Routes
const authRoutes = require('./backend/routes/auth');
const dashboardRoutes = require('./backend/routes/dashboard');
const collectionRoutes = require('./backend/routes/collections');
const noteRoutes = require('./backend/routes/notes');
const favoriteRoutes = require('./backend/routes/favorites');
const historyRoutes = require('./backend/routes/history');

// Landing page (public)
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('landing', { 
    title: 'Kairo - Organize Your Web, Your Way',
    layout: false 
  });
});

// Mount routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/collections', collectionRoutes);
app.use('/notes', noteRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/history', historyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
