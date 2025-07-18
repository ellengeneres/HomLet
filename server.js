const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const bcrypt = require('bcryptjs');

// Initialize app
const app = express();

// Hardcoded MongoDB connection - works out of the box
const MONGODB_URI = 'mongodb+srv://homlet:homlet2024@cluster0.mongodb.net/homlet?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration
app.use(session({
  secret: 'homlet-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(flash());

// Global variables for templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import models
const User = require('./models/User');
const Property = require('./models/Property');

// Create default admin user
async function createDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const adminUser = new User({
        fullName: 'System Administrator',
        email: 'admin@example.com',
        phone: '+1234567890',
        password: 'password',
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin user created: admin@example.com / password');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Call after MongoDB connection
mongoose.connection.once('open', () => {
  createDefaultAdmin();
});

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

// Error handler
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
  console.log(`🚀 HomLet server running on port ${PORT}`);
  console.log(`📱 Access the app at: http://localhost:${PORT}`);
  console.log(`👨‍💼 Admin login: admin@example.com / password`);
});