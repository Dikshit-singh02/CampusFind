const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/notifications', require('./routes/notices'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/buildings', require('./routes/buildings'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/locations', require('./routes/locations'));

// Socket.io real-time notices
io.on('connection', (socket) => {
  console.log('Admin or user connected:', socket.id);
  
  socket.on('join-notices', () => {
    socket.join('notices');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const emitNoticeUpdate = () => {
  io.to('notices').emit('noticeUpdated');
};

module.exports = { emitNoticeUpdate };

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server + Socket.IO running on port ${PORT}`));
