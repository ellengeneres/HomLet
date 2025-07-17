const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

// Init app
const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(flash());

// Global flash & user
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// View engine + layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const agentRoutes = require('./routes/agent');
const adminRoutes = require('./routes/admin');
const propertyRoutes = require('./routes/property');
const paymentRoutes = require('./routes/payment');

// Use routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/agent', agentRoutes);
app.use('/admin', adminRoutes);
app.use('/property', propertyRoutes);
app.use('/payment', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Server Error', 
    error: process.env.NODE_ENV === 'development' ? err : {} 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
