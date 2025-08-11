const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//App routes
const sendOtpRoute = require('./routes/app/sendOtpRoute');      
const verifyOtpRoute = require('./routes/app/verifyOtpRoute');
const userProfileRoute = require('./routes/app/userProfileRoute');

//Admin routes
const categoryTypeRoutes = require('./routes/admin/categoryType');
const entityRoutes = require('./routes/admin/entity');


const sequelize = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json()); 

app.use(bodyParser.json());

//App routes
app.use('/api', sendOtpRoute);      
app.use('/api', verifyOtpRoute);  
app.use('/api', userProfileRoute);

// Admin routes
app.use('/admin/category-types', categoryTypeRoutes);
app.use('/admin/entity', entityRoutes);

const PORT = 3000;

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Database sync failed:', err);
});
