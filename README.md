# Vehicle Service Package System

A full-stack web application for managing vehicle service packages with React frontend, Node.js/Express backend, and MongoDB database.

## 🎯 Features

### Frontend (React)
- **Service Package Display**: View all available service packages in a responsive grid
- **Package Details**: Each package shows name, price, services included, validity, and status
- **Interactive Booking**: Click "Book Service" to open a modal with booking form
- **State Management**: Uses `useState` hook to manage selected package and form data
- **Modern UI**: Premium design with glassmorphism effects, gradients, and smooth animations
- **Form Validation**: Client-side validation for customer name and vehicle type

### Backend (Node.js & Express)
- **POST /api/bookService**: Creates a new service booking
  - Accepts: `customerName`, `packageName`, `vehicleType`, `totalPrice`, `servicesIncluded`, `validityPeriod`
  - Returns: Booking confirmation with booking ID and status
  - Includes comprehensive validation and error handling
- **GET /api/bookings**: Retrieves all bookings (optional testing endpoint)
- **GET /api/booking/:id**: Retrieves specific booking by ID (optional testing endpoint)

### Database (MongoDB)
- **ServiceBooking Schema** with fields:
  - `customerName`: String (required, 2-100 chars)
  - `packageName`: String (required)
  - `vehicleType`: Enum (Hatchback, Sedan, SUV, Bike, Luxury Car, Electric Vehicle)
  - `bookingDate`: Date (auto-generated)
  - `bookingStatus`: Enum (Pending, Confirmed, Completed, Cancelled)
  - `serviceDate`: Date (auto-set to 3 days from booking)
  - `totalPrice`: Number (required, ≥ 0)
  - `servicesIncluded`: Array of Strings (required)
  - `validityPeriod`: String (required)
  - `notes`, `contactNumber`, `email`: Optional fields
  - Timestamps: `createdAt`, `updatedAt`

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
cd vehicle-service-system
```

### 2. Setup Backend

```bash
cd backend
npm install
```

**Configure MongoDB:**
- For **local MongoDB**, ensure MongoDB is running on `mongodb://localhost:27017`
- For **MongoDB Atlas**, update the connection string in `server.js`:
  ```javascript
  const MONGODB_URI = 'your-mongodb-atlas-connection-string';
  ```
  Or set environment variable:
  ```bash
  set MONGODB_URI=your-mongodb-atlas-connection-string
  ```

**Start the backend server:**
```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Setup Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 Usage

1. **View Service Packages**: Browse the available service packages on the main page
2. **Select a Package**: Click "Book Service" on any available package
3. **Fill Booking Form**: 
   - Enter your name
   - Select your vehicle type
4. **Submit Booking**: Click "Confirm Booking"
5. **Get Confirmation**: Receive booking ID and confirmation message

## 🔌 API Documentation

### POST /api/bookService

**Request:**
```json
{
  "customerName": "John Doe",
  "packageName": "Basic Service",
  "vehicleType": "Sedan",
  "totalPrice": 2999,
  "servicesIncluded": ["Engine Oil Change", "Oil Filter Replacement"],
  "validityPeriod": "3 months or 5,000 km"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Service booking confirmed! Your booking for Basic Service has been successfully created.",
  "bookingId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "booking": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "customerName": "John Doe",
    "packageName": "Basic Service",
    "vehicleType": "Sedan",
    "bookingStatus": "Pending",
    "bookingDate": "2026-01-02T05:30:00.000Z",
    "totalPrice": 2999
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Missing required fields. customerName, packageName, and vehicleType are required."
}
```

### GET /api/bookings

Returns all bookings sorted by booking date (most recent first).

### GET /api/booking/:id

Returns a specific booking by its MongoDB ObjectId.

### GET /health

Health check endpoint to verify server and database status.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Additional**: CORS for cross-origin requests

## 📁 Project Structure

```
vehicle-service-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ServicePackages.jsx
│   │   │   └── ServicePackages.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── models/
│   │   └── ServiceBooking.js
│   ├── routes/
│   │   └── bookingRoutes.js
│   ├── server.js
│   └── package.json
└── README.md
```

## 🎨 Service Packages Included

1. **Basic Service** (₹2,999) - 3 months/5,000 km
2. **Standard Service** (₹5,999) - 6 months/10,000 km
3. **Premium Service** (₹9,999) - 12 months/15,000 km
4. **Winter Special** (₹4,499) - 4 months/6,000 km
5. **Monsoon Care** (₹3,999) - 3 months/5,000 km (Expired)
6. **Luxury Package** (₹15,999) - 12 months/20,000 km

## 🔐 Environment Variables (Optional)

Create a `.env` file in the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vehicle-service-db
NODE_ENV=development
```

## 📝 Assignment Requirements Fulfilled

✅ **Frontend (React)**
- Display service packages using an array
- Use `useState` to store selected package
- Show package details on "Book Service" click

✅ **Backend (Node.js & Express)**
- POST `/api/bookService` endpoint created
- Accepts `customerName`, `packageName`, and `vehicleType`
- Returns service booking status
- Complete route handler logic with validation

✅ **Database (MongoDB)**
- MongoDB schema designed for service bookings
- Includes all required fields with proper validation
- Implements indexes for performance
- Includes helper methods and hooks

## 🤝 Contributing

This is an educational project. Feel free to modify and enhance it for your learning purposes.

## 📄 License

ISC
