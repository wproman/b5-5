
# 🚖 Ride Booking API

A secure, scalable, and role-based backend API for a ride booking system (like Uber or Pathao) built using Express.js, Mongoose, TypeScript, and JWT.



## 📦 Features

- 🔐 **JWT-based Authentication**
- 🎭 **Role-Based Access Control** (Admin, Rider, Driver)
- 🧍 **Rider Operations**
  - Request rides
  - Cancel rides
  - View history
  - Rate drivers
- 🚗 **Driver Operations**
  - Accept/reject rides
  - Update ride status
  - View earnings
  - Set availability
- 🛡 **Admin Controls**
  - Manage users
  - Approve/suspend drivers
  - View all rides
- 📜 **Complete Ride History**
- 🧱 **Modular Architecture**

## ⚙️ Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ride-booking-api.git
   cd ride-booking-api


2. Install dependencies

   ```bash
   npm install
   

3. Configure environment
   ```bash
   Create .env file:
    PORT=5000
    DB_URL=mongodb://localhost:27017/ride-booking
    NODE_ENV=development
    JWT_ACCESS_SECRET=yourSecretKey
    JWT_ACCESS_EXPIRES=1d
    WT_REFRESH_SECRET=yourSecretKey
    JWT_REFRESH_EXPIRES=7d
    BCRYPT_SALT_ROUNDS=10

4. Run the application

     ```bash
     # Development
      npm run dev

      # Production
       npm run build
       npm start


5.## 🔗 API Endpoints
    
  1.Register new user

 POST	api/v1/auth/register	

  Request:
    
    
      {"name": "John Doe",
      "email": "john1.doe@example.com",
      "password": "securePassword123",
      "phone": "+8801234567890",
      "picture": "https://example.com/profile.jpg",
      "address": "123 Main Street, Dhaka, Bangladesh",
      "isDeleted": false,
      "isActive": "active",
      "isVerified": true,
      "auths": [
        {
          "provider": "google",
          "providerId": "google-uid-12345"
        }
        ],
        "role": "rider"}




 Response
    
   
      {
    "success": true,
    "message": "User created successfully",
    "data": {
        "name": "John Doe",
        "email": "john1.doe@example.com",
        "password": "$2b$10$io9WXF9AkR/gezxRfdlaoOawNVcLMsbRG1edv.N2AsTJAogEPs846",
        "role": "rider",
        "phone": "+8801234567890",
        "picture": "https://example.com/profile.jpg",
        "address": "123 Main Street, Dhaka, Bangladesh",
        "isDeleted": false,
        "isActive": "active",
        "isBlocked": false,
        "isVerified": false,
        "_id": "6891a9fde03816ba5786476d",
        "createdAt": "2025-08-05T06:51:41.548Z",
        "updatedAt": "2025-08-05T06:51:41.548Z",
        "id": "6891a9fde03816ba5786476d"
    }
      }   

   POST	/api/v1/auth/login

   Requset

         {
        "email": "john1.doe@example.com",
          "password": "securePassword123"
           }

   Requset


{
    "success": true,
    "message": "User logged in successfully",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4xLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJyaWRlciIsImlkIjoiNjg5MWE5ZmRlMDM4MTZiYTU3ODY0NzZkIiwiaWF0IjoxNzU0Mzc2ODE4LCJleHAiOjE3NTQ0NjMyMTh9.UEBIZXWftN7de30hfbJvHzrkLffWPcJdOeAMQ8Wfnvk",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4xLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJyaWRlciIsImlkIjoiNjg5MWE5ZmRlMDM4MTZiYTU3ODY0NzZkIiwiaWF0IjoxNzU0Mzc2ODE4LCJleHAiOjE3NTQ5ODE2MTh9.w_Xno_iMBKvHmzbBGh29XwNe9cEr-afJhhTCCPmvyuM",
        "user": {
            "_id": "6891a9fde03816ba5786476d",
            "name": "John Doe",
            "email": "john1.doe@example.com",
            "role": "rider",
            "phone": "+8801234567890",
            "picture": "https://example.com/profile.jpg",
            "address": "123 Main Street, Dhaka, Bangladesh",
            "isDeleted": false,
            "isActive": "active",
            "isBlocked": false,
            "isVerified": false,
            "createdAt": "2025-08-05T06:51:41.548Z",
            "updatedAt": "2025-08-05T06:51:41.548Z",
            "id": "6891a9fde03816ba5786476d"
        }
    }

    
  **🧍 Rider Endpoints**

  POST	api/v1/rides/request	


Request
        {
          "pickupLocation": {
            "lat": 23.8103,
            "lng": 90.4125
          },
          "destination": {
            "lat": 23.7806,
            "lng": 90.4190
          }
        }

PATCH	/rides/:id/cancel	Cancel a ride
GET	/rides/me	Get ride history
POST	/rides/:id/rate	Rate completed ride
🚗 Driver Endpoints
Method	Endpoint	Description
PATCH	/rides/:id/accept	Accept ride request
PATCH	/rides/:id/status	Update ride status
GET	/drivers/earnings	View earnings history
PATCH	/drivers/availability	Set online/offline status
🛡 Admin Endpoints
Method	Endpoint	Description
GET	/admin/users	List all users
GET	/admin/rides	View all rides
PATCH	/drivers/approve/:id	Approve/suspend driver
PATCH	/users/block/:id	Block/unblock user
🧩 Technologies Used
Backend: Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JWT

Validation: Zod

Security: bcryptjs, helmet

Testing: Jest, Supertest

Documentation: Swagger UI

🗂 Project Structure
text
src/
├── config/         # Environment/config files
├── interfaces/     # TypeScript interfaces
├── middlewares/    # Custom middleware
├── modules/        # Feature modules
│   ├── auth/       # Authentication
│   ├── users/      # User management  
│   ├── driver/     # Driver operations
│   └── ride/       # Ride management
├── utils/          # Helper functions
├── app.ts          # Express app setup
└── server.ts       # Server initialization
📄 License
This project is licensed under the MIT License.