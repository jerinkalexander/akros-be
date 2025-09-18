require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authenticateToken = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

//App routes
const sendOtpRoute = require('./routes/sendOtpRoute');      
const verifyOtpRoute = require('./routes/verifyOtpRoute');

const userProfileRoute = require('./routes/userProfileRoute');
const entityAppRoutes = require('./routes/app/entityRoute');
const bookingAppRoute = require('./routes/app/bookingRoute');

//Admin routes
const categoryTypeRoutes = require('./routes/admin/categoryTypeRoute');
const entityRoutes = require('./routes/admin/entityRoute');
const bookingRoute = require('./routes/admin/bookingRoute');


const sequelize = require('./config/db');
require('./models/associations'); // Load model associations

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes that do NOT require authentication

// App routes (public)
app.use('/user', sendOtpRoute);
app.use('/user', verifyOtpRoute);


// Shop routes (public)
app.use('/shop', sendOtpRoute);
app.use('/shop', verifyOtpRoute);

// Routes that REQUIRE authentication

// Protected API routes
app.use('/api', authenticateToken);     
app.use('/api', userProfileRoute);
app.use('/api', entityAppRoutes);
app.use('/api', bookingAppRoute);

// Protected admin routes
app.use('/admin/category-types', categoryTypeRoutes);
app.use('/admin/shops', entityRoutes);
app.use('/admin/bookings', bookingRoute);

// Protected shop routes
app.use('/shop', authenticateToken);


const PORT = 3001;

// Start server (no sync)
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
