🚖 Ride Booking API
A secure, scalable, and role-based backend API for a ride booking system (like Uber or Pathao) built using Express.js, Mongoose, TypeScript, and JWT. It supports riders, drivers, and admins with authentication, ride lifecycle management, and user controls.

📦 Project Overview
Features:
🔐 JWT-based Authentication

🎭 Role-Based Access Control (Admin, Rider, Driver)

🧍 Rider & Driver Operations

🚗 Ride Request, Acceptance, Status Updates

📜 Ride History, Cancellation, Ratings

🧱 Modular & Maintainable Architecture

⚙️ Setup & Environment Instructions
1. Clone the Repository
git clone https://github.com/wproman/b5-5
cd b5-5
2. Install Dependencies
npm install
3. Create .env File
Create a .env file at the root with the following:


PORT =  5000
DB_URL =  mongodb://localhost:27017/ride-booking

NODE_ENV=development

JWT_ACCESS_SECRET=yourSecretKey
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=yourSecretKey
JWT_REFRESH_EXPIRES=7d

BCRYPT_SALT_ROUND =  10


SUPER_ADMIN_EMAIL=your email
SUPER_ADMIN_PASSWORD=your password


EXPRESS_SESSION_SECRET =  express-Session


4. Build the Project

npm run build
5. Run in Development

npm run dev
6. Run in Production

npm start
🔗 API Endpoints Summary
🔐 Auth Routes
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login and receive JWT
GET	/auth/me	Get current logged-in user

🧍 Rider Routes
Method	Endpoint	Description
POST	/rides/request	Request a new ride
PATCH	/rides/:id/cancel	Cancel a ride
GET	/rides/me	View ride history
POST	/rides/:id/rate	Rate a completed ride

🚗 Driver Routes
Method	Endpoint	Description
PATCH	/rides/:id/accept	Accept a ride request
PATCH	/rides/:id/status	Update ride status (picked_up, etc.)
GET	/drivers/earnings	View earnings
PATCH	/drivers/availability	Set availability (Online/Offline)

🛡 Admin Routes
Method	Endpoint	Description
GET	/admin/users	View all users
GET	/admin/rides	View all rides
PATCH	/drivers/approve/:id	Approve or suspend a driver
PATCH	/users/block/:id	Block or unblock a user

🧩 Technologies Used
Node.js / Express.js

TypeScript

Mongoose / MongoDB

JWT Authentication

Zod for request validation

bcryptjs for password hashing

🗂 Folder Structure

src/
├── config/
|── errorHelper/
├── helpers/
├── interface/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── driver/
│   ├── ride/
├── utils/
├── app.ts
├── server.ts




📄 License
This project is licensed under the MIT License.

