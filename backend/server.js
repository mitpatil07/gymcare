const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('GymCare API is running...');
});

// Socket.io Real-time Monitoring
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Receive vitals from mobile app every 3 seconds
  socket.on('vitals_update', (data) => {
    console.log('Received Vitals:', data);
    
    // Broadcast back to any connected trainer dashboard (optional)
    // or trigger risk detection logic on server if preferred
    socket.broadcast.emit('monitor_update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
