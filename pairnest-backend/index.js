const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/ProfileRoutes');
const InterestRoutes = require('./routes/InterestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const sessionMiddleware = require('./middleware/session');
const AdminRoutes = require('./routes/AdminRoutes');
const setUser = require('./middleware/setUser');

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Change this if deploying
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

// ✅ Make `io` available in routes (e.g. for broadcasting updates)
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);
app.use(setUser);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/interest', InterestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/Admin', AdminRoutes);
app.set('io', io); // ✅ makes `io` available in all routes

// Root route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// ✅ Setup WebSocket connection
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
