# 💕 Pairnest – Powered Matchmaking Platform

Pairnest is a full-stack matchmaking web app that uses personality traits, interests, and biometric verification to pair compatible users. Designed as a portfolio project, it features a user-friendly experience, advanced admin dashboard, real-time updates, and secure data handling.

---

## ✨ Features

### 👩‍❤️‍👨 User Side
- ✅ Sign up / Login with email and password
- ✅ Profile creation with:
  - Full name, gender, age, temperament, love language, etc.
- ✅ Interest selection & compatibility matching
- ✅ Mutual match confirmation (≥80% compatibility)
- ✅ Blind date booking (requires male partner payment)
- ✅ Face & thumbprint verification during signup (simulated)
- ✅ Notification inbox with admin messages
- ✅ Mobile-friendly responsive UI

### 🧑‍💼 Admin Dashboard
- ✅ View total users, matches, feedbacks (chart + stats)
- ✅ Search/filter users
- ✅ Ban / Unban users
- ✅ Edit user data
- ✅ View all bookings (with feedback/rating)
- ✅ Send notifications to users
- ✅ Real-time updates via WebSocket (e.g., user banned, new bookings)

---

## 📸 Screenshots

> Add your own screenshots here:
📷 Dashboard overview
📷 (image-1.png) Profile form
📷 Admin banning user
📷 Booking list

yaml
Copy
Edit

---

## 🔧 Tech Stack

### Frontend
- React.js (with Hooks)
- Axios
- React Router
- Framer Motion (animations)
- CSS Modules / Custom Styles

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Token (auth middleware)
- Socket.io (real-time updates)
- REST API with protected routes

---

## 🚀 Getting Started (Local Development)

### 🖥 Backend
```bash
cd backend
npm install
# Create a .env file and add:
# MONGO_URI=your_mongo_connection_string
node index.js
🌐 Frontend
bash
Copy
Edit
cd frontend
npm install
npm start
The app runs at:

http://localhost:3000 (Frontend)

http://localhost:5000 (Backend API)

🧪 Demo Credentials
You can simulate with test accounts like:

makefile
Copy
Edit
User:
Email: user@example.com
Password: 123456

Admin:
Email: daveside00468@gmail.com
Password: your_admin_password
📦 Folder Structure
bash
Copy
Edit
/backend
  /models
  /routes
  /middleware
  index.js

/frontend
  /components
  /pages
  /utils
  App.js
📈 Future Improvements (Optional)
Live video verification using face-api.js

Email & push notifications

Infinite scroll / pagination in admin panel

Analytics dashboard with D3.js or Chart.js

VIDEO DEMO LINK.
https://go.screenpal.com/watch/cTj23nn2opJ

👨‍💻 Author
David Joel – GitHub
Feel free to fork, star, and follow my journey!

📝 License
This project is for educational and portfolio use only.
Not intended for commercial deployment.
