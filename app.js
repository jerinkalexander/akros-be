const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const sendOtpRoute = require('./routes/sendOtpRoute');      
const verifyOtpRoute = require('./routes/verifyOtpRoute');
const userProfileRoute = require('./routes/userProfileRoute');


const sequelize = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json()); 

app.use(bodyParser.json());
app.use('/api', sendOtpRoute);      
app.use('/api', verifyOtpRoute);  
app.use('/api', userProfileRoute);

const PORT = 3000;

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Database sync failed:', err);
});
