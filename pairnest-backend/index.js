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
const server = http.createServer(app);

// ✅ CORS options: allow local + deployed frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',                         // local frontend
    'https://your-frontend-url.onrender.com'         // replace with your actual frontend URL on Render
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions)); // ✅ Use proper CORS settings
app.use(express.json());
app.use(sessionMiddleware);
app.use(setUser);

// ✅ WebSocket server with same CORS
const io = new Server(server, {
  cors: corsOptions
});

app.set('io', io); // ✅ Make io available in all routes

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/interest', InterestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/admin', AdminRoutes); // ⚠️ lowercase for consistent API path

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🌐 Pairnest backend is running...');
});

// ✅ WebSocket events
io.on('connection', (socket) => {
  console.log('🟢 WebSocket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 WebSocket disconnected:', socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
