const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport'); // Import passport configuration
const jwt = require('jsonwebtoken'); // Ensure jwt is imported
const cors = require('cors'); // Import cors
const User = require('./models/User');
const Stock = require('./models/Stock'); // Add Stock model

require('dotenv').config();

// ========== [1] Verify .env Loading ==========
console.log('[0] .env Variables Check:', {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  SECRET: process.env.GOOGLE_CLIENT_SECRET ? '***' : 'MISSING',
  SERVER_URL: process.env.SERVER_URL
});

// ========== [2] Configure Passport ==========
console.log('[1] Attempting Google Strategy setup...');
// Passport configuration is now handled in config/passport.js

// Serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ========== [3] Express Setup ==========
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Required for localhost
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  next();
});

// ========== [5] Routes ==========
const users = require('./routes/users');
const admins = require('./routes/admins'); // Add this line
const providers = require('./routes/providers');
const demanders = require('./routes/demanders'); // Ensure this is imported
const products = require('./routes/product'); // Ensure this is imported
const orders = require('./routes/orders');
const payment = require('./routes/payment'); // ton fichier s'appelle payment.js



const chatbotRoute = require('./routes/chatbot'); // Ensure this is imported
const stocks = require('./routes/stocks');
app.use('/api/users', users);
app.use('/api/admins', admins);
app.use('/api/providers', providers);
app.use('/api/demanders', demanders); // Ensure this is registered

app.use('/api/products', products); // Ensure this is used
app.use('/api/orders', orders);
app.use('/api/stocks', stocks); // Add this line
app.use('/api/chatbot', chatbotRoute); // Add this line
app.use('/api/payment', payment);


app.get('/test', (req, res) => {
  console.log('[TEST ROUTE] Hit');
  res.send('✅ Test route working');
});

app.post('/train', (req, res) => {
    exec('node train_priority_model.js', (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return res.status(500).send('Error during training');
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Training started');
    });
});

app.get('/api/auth/google', (req, res, next) => {
  console.log('[AUTH] Google route hit');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
      try {
        let user = await User.findOne({ googleId: req.user.id });
        if (!user) {
          user = new User({
            googleId: req.user.id,
            email: req.user.emails[0].value,
            username: req.user.displayName,
            verified: true
          });
          await user.save();
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&googleId=${user.googleId}`);
      } catch (error) {
        console.error('[X] Google OAuth Callback Error:', error);
        res.redirect('/login');
      }
    }
);
// ========== [5] Server Start ==========
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true // Add this to fix ensureIndex warning
})
    .then(() => {
      console.log('[3] MongoDB Connected');
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log('\n=== SERVER LIVE ===');
        console.log(`PORT: ${PORT}`);
        console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
        console.log(`CALLBACK: ${process.env.SERVER_URL}/api/auth/google/callback\n`);
      });
    })
    .catch(err => {
      console.error('[X] MongoDB Connection Failed:', err);
      process.exit(1);
    });