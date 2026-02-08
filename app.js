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
const parkingRoute = require('./routes/admin/parkingRoute');
const shopImageRoute = require('./routes/admin/shopImageRoute');
const merchantRoute = require('./routes/admin/merchantRoute');
const adminLoginRoute = require('./routes/admin/loginRoute');
const adminRegisterRoute = require('./routes/admin/registerRoute');
const adminUserRoute = require('./routes/admin/userRoute');

//Merchant routes
const shopRoute = require('./routes/merchants/shopRoute');
const merchantBookingRoute = require('./routes/merchants/bookingRoute');


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

// Merchant routes (public)
app.use('/merchant', sendOtpRoute);
app.use('/merchant', verifyOtpRoute);

// Admin auth routes (public - no token needed)
// Use specific routes to avoid catching protected admin routes
app.use('/admin/login', adminLoginRoute);
app.use('/admin/register', adminRegisterRoute);

// Protected API routes
app.use('/api', authenticateToken);
app.use('/api', userProfileRoute);
app.use('/api', entityAppRoutes);
app.use('/api/bookings', bookingAppRoute);

// Protected admin routes (all other /admin/* routes require auth)
app.use('/admin', authenticateToken);
app.use('/admin/category-types', categoryTypeRoutes);
app.use('/admin/shops', entityRoutes);
app.use('/admin/shop-images', shopImageRoute);
app.use('/admin/bookings', bookingRoute);
app.use('/admin/parking', parkingRoute);
app.use('/admin/merchants', merchantRoute);
app.use('/admin/users', adminUserRoute);

app.use('/merchant/', authenticateToken);
app.use('/merchant/shops', shopRoute);
app.use('/merchant/bookings', merchantBookingRoute);


const PORT = 3000;

// Start server (no sync)
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));