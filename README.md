# 🚴 Bike Ride Booking System

A full-stack real-time bike ride booking application with live GPS tracking, automated rider assignment, and comprehensive admin dashboard.

## ✨ Features

### User Features
- Book rides with interactive map interface
- Real-time fare calculation based on distance and peak hours
- OTP email verification for ride security
- Live rider location tracking
- View ride history and status
- Rate and review completed rides

### Rider Features
- View and accept pending rides
- Start and complete rides
- Real-time GPS location sharing
- Track earnings (daily, weekly, monthly)
- View ride history and ratings
- Online/offline status toggle

### Admin Features
- Comprehensive dashboard with analytics
- View all rides and system statistics
- Monitor online riders and users
- Track revenue metrics
- Manage pricing configuration

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.IO (Real-time communication)
- JWT Authentication
- Nodemailer (Email service)

**Frontend:**
- React 18
- React Router v6
- Leaflet & React Leaflet (Maps)
- Axios
- Socket.IO Client

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/bike-ride-booking.git
cd bike-ride-booking
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` file:
```env
MONGO_URI=mongodb://localhost:27017/bike-ride-booking
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE=gmail
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 4. Start MongoDB
```bash
mongod
```

### 5. Run the Application

**Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage

### Register Users
1. Go to http://localhost:3000/register
2. Create accounts with different roles:
   - **User**: Can book rides
   - **Rider**: Can accept and complete rides
   - **Admin**: Can view dashboard (manually set in database)

### Book a Ride (User)
1. Login as a user
2. Click "Book New Ride"
3. Select pickup and drop locations on the map
4. Enter customer details
5. Confirm booking
6. Check email for OTP

### Accept Rides (Rider)
1. Login as a rider
2. View pending rides
3. Accept a ride
4. Start the ride
5. Complete when done

### Admin Dashboard
1. Login as admin
2. View statistics and analytics
3. Monitor all rides
4. Track revenue and users

## 🔧 Key Features Implementation

### Real-time Tracking
Uses Socket.IO for bidirectional communication between riders and users, updating location markers on the map in real-time.

### Fare Calculation
Dynamic pricing based on:
- Base fare: ₹20
- Distance fare: ₹10 per km
- Peak hour multiplier: 1.5x (8-10 AM, 5-8 PM)

### Rider Assignment
Automated algorithm assigns the nearest available online rider based on GPS coordinates using the Haversine formula.

### Email Notifications
Sends automated emails for:
- Ride booking confirmation with OTP
- Rider assignment
- Ride status updates
- Ride completion

## 📂 Project Structure

```
bike-ride-booking/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Email service
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── app/         # App routes
    │   ├── components/  # Reusable components
    │   ├── layout/      # Layout components
    │   ├── pages/       # Page components
    │   ├── services/    # API & Socket services
    │   └── utils/       # Helper utilities
    └── public/          # Static files
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE=gmail
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rides (Protected)
- `POST /api/ride/book` - Book a new ride
- `GET /api/ride/my-rides` - Get user's rides
- `GET /api/ride/pending` - Get pending rides (Rider)
- `POST /api/ride/accept/:id` - Accept ride (Rider)
- `POST /api/ride/start/:id` - Start ride (Rider)
- `POST /api/ride/complete/:id` - Complete ride (Rider)
- `POST /api/ride/cancel/:id` - Cancel ride
- `POST /api/ride/rate/:id` - Rate ride
- `GET /api/ride/:id` - Get ride details

### Admin (Protected)
- `GET /api/ride/admin/all-rides` - Get all rides
- `GET /api/ride/admin/stats` - Get statistics

## 🧪 Testing

### Create Test Accounts

**User:**
```
Email: user@test.com
Password: password123
Role: user
```

**Rider:**
```
Email: rider@test.com
Password: password123
Role: rider
```

**Admin:**
Create a user, then update in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Create account on deployment platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy!

### Frontend (Vercel/Netlify)
1. Create account
2. Import GitHub repository
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy!

### MongoDB Atlas
1. Create free cluster at mongodb.com
2. Get connection string
3. Update MONGO_URI in backend .env

## 🛡️ Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- Environment variable protection
- Input validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your-email@gmail.com

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet.js for mapping library
- Socket.IO for real-time communication

---

**⭐ If you find this project helpful, please give it a star!**
