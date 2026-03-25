# CampusFind

CampusFind is a Smart Campus Navigation and Utility System built with the MERN stack. It provides features like user authentication, campus map navigation, lost & found system, emergency SOS, smart notice board, QR code based room finder, and an admin dashboard.

## Features

- **User Authentication**: JWT-based authentication with roles (Student, Faculty, Admin)
- **Campus Map Navigation**: Interactive map with building coordinates and route planning using Google Maps API
- **Lost & Found System**: Post lost items and found items with image uploads
- **Emergency SOS System**: Send user location and store SOS requests
- **Smart Notice Board**: Admin can post notices, students can view them
- **QR Code based Room Finder**: Scan QR codes to get room details
- **Admin Dashboard**: Approve lost/found posts, manage users and notices

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Image Upload**: Multer
- **Maps**: Google Maps API
- **QR Code**: qrcode and html5-qrcode

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Maps API key

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory and add your environment variables:
   ```
   MONGO_URI=mongodb://localhost:27017/campusfind
   JWT_SECRET=your_jwt_secret_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

### Running the Application

1. Ensure MongoDB is running on your system.
2. Start the backend server (from backend directory): `npm start`
3. Start the frontend server (from frontend directory): `npm start`
4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Buildings
- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/:id` - Get building by ID
- `POST /api/buildings` - Create building (Admin only)
- `PUT /api/buildings/:id` - Update building (Admin only)
- `DELETE /api/buildings/:id` - Delete building (Admin only)

### Lost & Found
- `GET /api/lostfound/lost` - Get lost items
- `POST /api/lostfound/lost` - Post lost item
- `GET /api/lostfound/found` - Get found items
- `POST /api/lostfound/found` - Post found item

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (Admin only)
- `PUT /api/notices/:id` - Update notice (Admin only)
- `DELETE /api/notices/:id` - Delete notice (Admin only)

### SOS
- `POST /api/sos` - Create SOS request
- `GET /api/sos` - Get SOS requests
- `GET /api/sos/:id` - Get SOS by ID
- `PUT /api/sos/:id` - Update SOS
- `DELETE /api/sos/:id` - Delete SOS

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room (Admin only)
- `PUT /api/rooms/:id` - Update room (Admin only)
- `DELETE /api/rooms/:id` - Delete room (Admin only)

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)
- `GET /api/admin/lostfound` - Get all lost/found items (Admin only)
- `PUT /api/admin/lostfound/:id/approve` - Approve lost/found item (Admin only)
- `PUT /api/admin/lostfound/:id/reject` - Reject lost/found item (Admin only)
- `GET /api/admin/notices` - Get all notices (Admin only)
- `POST /api/admin/notices` - Create notice (Admin only)
- `PUT /api/admin/notices/:id` - Update notice (Admin only)
- `DELETE /api/admin/notices/:id` - Delete notice (Admin only)
- `GET /api/admin/sos` - Get all SOS requests (Admin only)

## Database Models

- **User**: name, email, password, role (student/faculty/admin)
- **Building**: name, description, coordinates, floors
- **LostItem**: title, description, category, location, dateLost, images, contactInfo, user, status
- **FoundItem**: title, description, category, location, dateFound, images, contactInfo, user, status
- **Notice**: title, content, category, createdBy, createdAt
- **SOS**: user, location, message, status, createdAt
- **Room**: building, floor, roomNumber, type, description, qrCode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

