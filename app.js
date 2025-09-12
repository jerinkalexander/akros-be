const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authenticateToken = require('./middleware/auth');

//App routes
const sendOtpRoute = require('./routes/app/sendOtpRoute');      
const verifyOtpRoute = require('./routes/app/verifyOtpRoute');
const userProfileRoute = require('./routes/app/userProfileRoute');
const entityAppRoutes = require('./routes/app/entityRoute');
const bookingAppRoute = require('./routes/app/bookingRoute');

//Admin routes
const categoryTypeRoutes = require('./routes/admin/categoryType');
const entityRoutes = require('./routes/admin/entity');
const bookingRoute = require('./routes/admin/booking');



const sequelize = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json()); 

app.use(bodyParser.json());


// App routes that do NOT require token
app.use('/api', sendOtpRoute);

// Token verification for all other /api routes
app.use('/api', authenticateToken);
app.use('/api', sendOtpRoute);      
app.use('/api', verifyOtpRoute);  
app.use('/api', userProfileRoute);
app.use('/api', entityAppRoutes);
app.use('/api', bookingAppRoute);

// Admin routes
app.use('/admin', authenticateToken);
app.use('/admin/category-types', categoryTypeRoutes);
app.use('/admin/entities', entityRoutes);
app.use('/admin/bookings', bookingRoute);

const PORT = 3000;

// Start server (no sync)
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
