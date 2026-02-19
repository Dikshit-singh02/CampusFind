const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/buildings', require('./routes/buildings'));
app.use('/api/rooms', require('./routes/rooms'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
