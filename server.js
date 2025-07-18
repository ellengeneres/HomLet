const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const bcrypt = require('bcryptjs');

// Initialize Express app
const app = express();

// Hardcoded MongoDB connection - works immediately without any config
const MONGODB_URI = 'mongodb+srv://homlet:homlet2024@cluster0.mongodb.net/homlet?retryWrites=true&w=majority';

// Connect to MongoDB with proper error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Atlas connected successfully');
  console.log('🏠 HomLet database is ready');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('⚠️  App will continue but database features may not work');
});

// Essential middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Static files - serve uploads and public assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration - hardcoded for immediate functionality
app.use(session({
  secret: 'homlet-ultra-secure-session-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages for user feedback
app.use(flash());

// Global template variables - available in all EJS templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// EJS template engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import database models
const User = require('./models/User');
const Property = require('./models/Property');
const Deal = require('./models/Deal');
const Rating = require('./models/Rating');

// Create default admin user on startup
async function createDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@homlet.com' });
    if (!existingAdmin) {
      const adminUser = new User({
        fullName: 'HomLet Administrator',
        email: 'admin@homlet.com',
        phone: '+234-800-HOMLET',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin created: admin@homlet.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('⚠️  Error creating admin user:', error.message);
  }
}

// Initialize admin after database connection
mongoose.connection.once('open', () => {
  createDefaultAdmin();
});

// Import and use route modules
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const agentRoutes = require('./routes/agent');
const adminRoutes = require('./routes/admin');
const propertyRoutes = require('./routes/property');
const paymentRoutes = require('./routes/payment');

// Route middleware - order matters!
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/agent', agentRoutes);
app.use('/admin', adminRoutes);
app.use('/property', propertyRoutes);
app.use('/payment', paymentRoutes);

// 404 Error Handler - custom page for missing routes
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Page Not Found - HomLet',
    url: req.originalUrl 
  });
});

// Global Error Handler - catches all server errors
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).render('error', { 
    title: 'Server Error - HomLet',
    error: isDevelopment ? err : { message: 'Something went wrong!' }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n🚀 HomLet Server Started Successfully!');
  console.log(`📱 Access the app at: http://localhost:${PORT}`);
  console.log(`👨‍💼 Admin login: admin@homlet.com / admin123`);
  console.log(`🏠 Ready to serve property listings!\n`);
});

module.exports = app;