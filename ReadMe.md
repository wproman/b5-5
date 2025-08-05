
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
        "accessToken": ----,
        "refreshToken": -----,
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


 Response 

      {
    "success": true,
    "message": "Users retrieved successfully",
    "data": {
        "riderId": "6891a9fde03816ba5786476d",
        "pickupLocation": {
            "coordinates": []
        },
        "destination": {
            "coordinates": []
        },
        "rideStatus": "requested",
        "requestedAt": "2025-08-05T07:00:42.108Z",
        "fare": 261,
        "paymentStatus": "pending",
        "_id": "6891ac1ae03816ba57864773",
        "statusHistory": [],
        "createdAt": "2025-08-05T07:00:42.117Z",
        "updatedAt": "2025-08-05T07:00:42.117Z",
        "__v": 0
    }


PATCH	api/v1/rides/:id/cancel	Cancel a ride

  Request

          {
      "reason": "Optional cancellation reason"  
          }

Response

        {
        "success": true,
        "message": "Ride cancelled successfully",
        "data": {
            "pickupLocation": {
                "coordinates": []
            },
            "destination": {
                "coordinates": []
            },
            "_id": "6891ac1ae03816ba57864773",
            "riderId": "6891a9fde03816ba5786476d",
            "rideStatus": "cancelled",
            "requestedAt": "2025-08-05T07:00:42.108Z",
            "fare": 261,
            "paymentStatus": "pending",
            "statusHistory": [
                {
                    "status": "cancelled",
                    "timestamp": "2025-08-05T07:02:30.885Z",
                    "changedBy": "rider",
                    "_id": "6891ac86e03816ba5786477f"
                }
            ],
            "createdAt": "2025-08-05T07:00:42.117Z",
            "updatedAt": "2025-08-05T07:02:30.890Z",
            "__v": 1,
            "cancelledAt": "2025-08-05T07:02:30.885Z",
            "cancelledBy": "rider",
            "cancellationReason": "Optional cancellation reason"


GET	api/v1/rides/me	Get ride history

  Response

      {
    "success": true,
    "message": "Ride history fetched successfully",
    "data": [
        {
            "rideId": "6891ac1ae03816ba57864773",
            "pickupLocation": {
                "coordinates": []
            },
            "destination": {
                "coordinates": []
            },
            "rideStatus": "cancelled",
            "fare": 261,
            "paymentStatus": "pending",
            "requestedAt": "2025-08-05T07:00:42.108Z",
            "statusHistory": [
                {
                    "status": "cancelled",
                    "timestamp": "2025-08-05T07:02:30.885Z",
                    "changedBy": "rider",
                    "_id": "6891ac86e03816ba5786477f"
                }
            ]
        }
    ]


POST	/rides/:id/rate	Rate completed ride
 Reqest 

      {
      "rating": 5,
      "feedback": "Excellent trip!"
       }

  Response

      {
        "success": true,
        "message": "Rating submitted successfully",
        "data": {
            "pickupLocation": {
                "coordinates": []
            },
            "destination": {
                "coordinates": []
            },
            "driverRating": {
                "rating": 5,
                "feedback": "Excellent trip!"
            },
            "_id": "6891ad1be03816ba5786478e",
            "riderId": "6891a9fde03816ba5786476d",
            "rideStatus": "completed",
            "requestedAt": "2025-08-05T07:04:59.320Z",
            "fare": 261,
            "paymentStatus": "paid",
            "statusHistory": [
                {
                    "status": "accepted",
                    "timestamp": "2025-08-05T07:07:47.594Z",
                    "changedBy": "driver",
                    "_id": "6891adc3e03816ba578647aa"
                },
                {
                    "timestamp": "2025-08-05T07:11:06.969Z",
                    "changedBy": "driver",
                    "_id": "6891ae8ae03816ba578647b2"
                }
            ],
            "createdAt": "2025-08-05T07:04:59.322Z",
            "updatedAt": "2025-08-05T09:11:10.568Z",
            "__v": 2,
            "acceptedAt": "2025-08-05T07:07:47.594Z",
            "driverId": "688db8b44c75790eb47823cc",
            "completedAt": "2025-08-05T07:11:06.969Z"
        }
    }
   
🚗 Driver Endpoints


PATCH	apiv1/rides/:id/accept	Accept ride request

   
Response

      {
    "success": true,
    "message": "Users retrieved successfully",
    "data": {
        "pickupLocation": {
            "coordinates": []
        },
        "destination": {
            "coordinates": []
        },
        "_id": "6891ad1be03816ba5786478e",
        "riderId": "6891a9fde03816ba5786476d",
        "rideStatus": "accepted",
        "requestedAt": "2025-08-05T07:04:59.320Z",
        "fare": 261,
        "paymentStatus": "pending",
        "statusHistory": [
            {
                "status": "accepted",
                "timestamp": "2025-08-05T07:07:47.594Z",
                "changedBy": "driver",
                "_id": "6891adc3e03816ba578647aa"
            }
        ],
        "createdAt": "2025-08-05T07:04:59.322Z",
        "updatedAt": "2025-08-05T07:07:47.597Z",
        "__v": 1,
        "driverId": "688db8b44c75790eb47823cc",
        "acceptedAt": "2025-08-05T07:07:47.594Z"
    }
}

PATCH	/rides/:id/status	Update ride status

Request

    {
      "status":  "completed"
    } 
    // {
    //   "status": "picked_up"
    // }

    // {
    //   "status":  "in_transit"
    // }

Response

      {
    "success": true,
    "message": "Users retrieved successfully",
    "data": {
        "pickupLocation": {
            "coordinates": []
        },
        "destination": {
            "coordinates": []
        },
        "_id": "6891ad1be03816ba5786478e",
        "riderId": "6891a9fde03816ba5786476d",
        "rideStatus": "completed",
        "requestedAt": "2025-08-05T07:04:59.320Z",
        "fare": 261,
        "paymentStatus": "paid",
        "statusHistory": [
            {
                "status": "accepted",
                "timestamp": "2025-08-05T07:07:47.594Z",
                "changedBy": "driver",
                "_id": "6891adc3e03816ba578647aa"
            },
            {
                "timestamp": "2025-08-05T07:11:06.969Z",
                "changedBy": "driver",
                "_id": "6891ae8ae03816ba578647b2"
            }
        ],
        "createdAt": "2025-08-05T07:04:59.322Z",
        "updatedAt": "2025-08-05T07:11:06.970Z",
        "__v": 2,
        "acceptedAt": "2025-08-05T07:07:47.594Z",
        "driverId": "688db8b44c75790eb47823cc",
        "completedAt": "2025-08-05T07:11:06.969Z"
    }
      }

GET	api/v1/drivers/earnings	View earnings history


Response 

      {
    "success": true,
    "message": "Earnings history fetched successfully",
    "data": [
        {
            "amount": 100,
            "date": "2025-08-02T07:23:29.316Z"
        },
        {
            "amount": 0,
            "date": "2025-08-02T15:06:32.595Z"
        },
        {
            "amount": 261,
            "date": "2025-08-03T17:31:33.784Z"
        },
        {
            "amount": 261,
            "date": "2025-08-05T07:04:59.322Z"
        }
    ]

PATCH	/driver/availability	Set online/offline status

Request 

      // {
        //   "onlineStatus": true,
        //   "currentLocation": {
        //     "coordinates": [-73.987654, 40.748817],
        //     "address": "Times Square"
        //   }
        // }


        {
          "onlineStatus": false
        }

Response

        {
    "success": true,
    "message": "Users retrieved successfully",
    "data": {
        "vehicleInfo": {
            "model": "Toyota Prius",
            "plate": "DHA-9876",
            "color": "White"
        },
        "currentLocation": {
            "type": "Point",
            "coordinates": [
                -73.987654,
                40.748817
            ]
        },
        "_id": "688db8b44c75790eb47823ce",
        "userId": "688db8b44c75790eb47823cc",
        "licenseNumber": "DL1234567890",
        "approvalStatus": "approved",
        "onlineStatus": false,
        "earnings": 0,
        "rating": 0,
        "__v": 0,
        "updatedAt": "2025-08-05T07:13:00.855Z"
    }
      }


🛡 Admin Endpoints

GET	api/vi/user	List all users

        {
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
        {
            "isBlocked": false,
            "_id": "688cec0804a2997806a903d7",
            "name": "Super admin",
            "email": "super@gmail.com",
            "password": "$2b$10$r5qd/8neKUI43dGzosbypufT1YapZtUcPDAleUItsNPKYj8GRvHle",
            "role": "admin",
            "isDeleted": false,
            "isActive": "active",
            "isVerified": true,
            "createdAt": "2025-08-01T16:32:08.207Z",
            "updatedAt": "2025-08-01T16:32:08.207Z",
            "id": "688cec0804a2997806a903d7"
        },
        {
            "_id": "688db8b44c75790eb47823cc",
            "name": "John Driver",
            "email": "john2.driver@example.com",
            "password": "$2b$10$roLX3wwddQh0hBB4poVFwuhooanGlKysHil6vma.gCfdgnzk0aMky",
            "role": "driver",
            "phone": "+8801234567890",
            "picture": "https://example.com/profile.jpg",
            "address": "123 Main Street, Dhaka",
            "isDeleted": false,
            "isActive": "active",
            "isVerified": false,
            "createdAt": "2025-08-02T07:05:24.445Z",
            "updatedAt": "2025-08-03T02:15:47.895Z",
            "isBlocked": false,
            "id": "688db8b44c75790eb47823cc"
        },
        {
            "_id": "688db9a38405c606e3abb6af",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "password": "$2b$10$91qSpAqOV3A4ocCbPrkXxOBhZGCbjHgTt6vOUbldxPsQcT4Hasblq",
            "role": "rider",
            "phone": "+8801234567890",
            "picture": "https://example.com/profile.jpg",
            "address": "123 Main Street, Dhaka, Bangladesh",
            "isDeleted": false,
            "isActive": "active",
            "isVerified": false,
            "createdAt": "2025-08-02T07:09:23.507Z",
            "updatedAt": "2025-08-03T02:57:53.381Z",
            "isBlocked": false,
            "id": "688db9a38405c606e3abb6af"
        },
        {
            "_id": "6891a9fde03816ba5786476d",
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
            "createdAt": "2025-08-05T06:51:41.548Z",
            "updatedAt": "2025-08-05T06:51:41.548Z",
            "id": "6891a9fde03816ba5786476d"
        }
    ]
    }
GET	api/v1/rides	View all rides

    {
    "success": true,
    "message": "Ride history fetched successfully",
    "data": [
        {
            "pickupLocation": {
                "coordinates": []
            },
            "destination": {
                "coordinates": []
            },
            "_id": "6891ad1be03816ba5786478e",
            "riderId": {
                "_id": "6891a9fde03816ba5786476d",
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
                "createdAt": "2025-08-05T06:51:41.548Z",
                "updatedAt": "2025-08-05T06:51:41.548Z",
                "id": "6891a9fde03816ba5786476d"
            },
            "rideStatus": "completed",
            "requestedAt": "2025-08-05T07:04:59.320Z",
            "fare": 261,
            "paymentStatus": "paid",
            "statusHistory": [
                {
                    "status": "accepted",
                    "timestamp": "2025-08-05T07:07:47.594Z",
                    "changedBy": "driver",
                    "_id": "6891adc3e03816ba578647aa"
                },
                {
                    "timestamp": "2025-08-05T07:11:06.969Z",
                    "changedBy": "driver",
                    "_id": "6891ae8ae03816ba578647b2"
                }
            ],
            "createdAt": "2025-08-05T07:04:59.322Z",
            "updatedAt": "2025-08-05T07:11:06.970Z",
            "__v": 2,
            "acceptedAt": "2025-08-05T07:07:47.594Z",
            "driverId": {
                "_id": "688db8b44c75790eb47823cc",
                "name": "John Driver",
                "email": "john2.driver@example.com",
                "password": "$2b$10$roLX3wwddQh0hBB4poVFwuhooanGlKysHil6vma.gCfdgnzk0aMky",
                "role": "driver",
                "phone": "+8801234567890",
                "picture": "https://example.com/profile.jpg",
                "address": "123 Main Street, Dhaka",
                "isDeleted": false,
                "isActive": "active",
                "isVerified": false,
                "createdAt": "2025-08-02T07:05:24.445Z",
                "updatedAt": "2025-08-03T02:15:47.895Z",
                "isBlocked": false,
                "id": "688db8b44c75790eb47823cc"
            },
            "completedAt": "2025-08-05T07:11:06.969Z"
        },
        {
            "pickupLocation": {
                "coordinates": []
            },
            "destination": {
                "coordinates": []
            },
            "_id": "6891aceee03816ba57864787",
            "riderId": {
                "_id": "6891a9fde03816ba5786476d",
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
                "createdAt": "2025-08-05T06:51:41.548Z",
                "updatedAt": "2025-08-05T06:51:41.548Z",
                "id": "6891a9fde03816ba5786476d"
            },
            "rideStatus": "requested",
            "requestedAt": "2025-08-05T07:04:14.169Z",
            "fare": 261,
            "paymentStatus": "pending",
            "statusHistory": [],
            "createdAt": "2025-08-05T07:04:14.171Z",
            "updatedAt": "2025-08-05T07:04:14.171Z",
            "__v": 0
        }
    ],
    "meta": {
        "page": 1,
        "limit": 2,
        "total": 13
    }
        }

PATCH	/driver/approve/:id	Approve/suspend driver
   
   Request

      {
      "approvalStatus": "approved" 
    }

Response

      {
    "success": true,
    "message": "Driver status updated to approved",
    "data": {
        "vehicleInfo": {
            "model": "Toyota Prius",
            "plate": "DHA-9876",
            "color": "White"
        },
        "currentLocation": {
            "type": "Point",
            "coordinates": [
                -73.987654,
                40.748817
            ]
        },
        "_id": "688db8b44c75790eb47823ce",
        "userId": "688db8b44c75790eb47823cc",
        "licenseNumber": "DL1234567890",
        "approvalStatus": "approved",
        "onlineStatus": false,
        "earnings": 0,
        "rating": 0,
        "__v": 0,
        "updatedAt": "2025-08-05T07:06:43.918Z"
    }
    }
PATCH	/user/block/:id	Block/unblock user

        {
    "success": true,
    "message": "User blocked successfully",
    "data": {
        "_id": "688db9a38405c606e3abb6af",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "$2b$10$91qSpAqOV3A4ocCbPrkXxOBhZGCbjHgTt6vOUbldxPsQcT4Hasblq",
        "role": "rider",
        "phone": "+8801234567890",
        "picture": "https://example.com/profile.jpg",
        "address": "123 Main Street, Dhaka, Bangladesh",
        "isDeleted": false,
        "isActive": "active",
        "isVerified": false,
        "createdAt": "2025-08-02T07:09:23.507Z",
        "updatedAt": "2025-08-05T07:19:02.343Z",
        "isBlocked": true,
        "id": "688db9a38405c606e3abb6af"
    }
    }
PATCH	/user/unblock/:id

      {
    "success": true,
    "message": "User unblocked successfully",
    "data": {
        "_id": "688db9a38405c606e3abb6af",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "$2b$10$91qSpAqOV3A4ocCbPrkXxOBhZGCbjHgTt6vOUbldxPsQcT4Hasblq",
        "role": "rider",
        "phone": "+8801234567890",
        "picture": "https://example.com/profile.jpg",
        "address": "123 Main Street, Dhaka, Bangladesh",
        "isDeleted": false,
        "isActive": "active",
        "isVerified": false,
        "createdAt": "2025-08-02T07:09:23.507Z",
        "updatedAt": "2025-08-05T07:20:08.397Z",
        "isBlocked": false,
        "id": "688db9a38405c606e3abb6af"
    }
      }

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