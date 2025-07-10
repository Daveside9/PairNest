const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // ✅ ADD THIS

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/ProfileRoutes');
const InterestRoutes = require('./routes/InterestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const sessionMiddleware = require('./middleware/session');
const AdminRoutes = require('./routes/AdminRoutes');
const setUser = require('./middleware/setUser');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // ✅ Update this to your frontend domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io); // ✅ WebSocket available in routes

// Middleware
app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);
app.use(setUser);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/interest', InterestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/admin', AdminRoutes); // ⚠️ lowercase 'admin' for consistency

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, 'client', 'build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Test route (optional if you're serving frontend separately)
app.get('/', (req, res) => {
  res.send('🌐 Pairnest backend is running...');
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('🟢 WebSocket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 WebSocket disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
