markdown
# 🚖 Ride Booking API

A secure, scalable, and role-based backend API for a ride booking system (like Uber or Pathao) built using Express.js, Mongoose, TypeScript, and JWT.

![API Architecture](https://i.imgur.com/Jq6Qv0E.png) *(example architecture diagram)*

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

```bash
3. Configure environment

Create .env file:

PORT=5000
DB_URL=mongodb://localhost:27017/ride-booking
NODE_ENV=development
JWT_ACCESS_SECRET=yourSecretKey
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=yourSecretKey
JWT_REFRESH_EXPIRES=7d
BCRYPT_SALT_ROUNDS=10

4. Run the application

```bash
# Development
npm run dev

# Production
npm run build
npm start
🔗 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login and get JWT
GET	/auth/me	Get current user
🧍 Rider Endpoints
Method	Endpoint	Description
POST	/rides/request	Request new ride
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