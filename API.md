# API Documentation

This document provides comprehensive information about all API endpoints used by the StaffAttend frontend application.

## Base URL

```
http://localhost:5000/api
```

Configure this in your `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained during login and stored in localStorage. The API client automatically includes it in all requests.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Authentication Endpoints

### Login

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "ADMIN" | "STAFF"
    }
  },
  "message": "Login successful"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid credentials
- `401` - Unauthorized

---

### Get Current User Profile

**GET** `/auth/me`

Returns the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ADMIN" | "STAFF",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

## Staff Management Endpoints

### Get All Staff

**GET** `/staff`

Returns a list of all staff members. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "staff@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "STAFF",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

### Get Staff by ID

**GET** `/staff/:id`

Returns details of a specific staff member. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "staff@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "STAFF",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found

---

### Create Staff

**POST** `/staff`

Creates a new staff member. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newstaff@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "Staff",
  "role": "STAFF" | "ADMIN"
}
```

**Validation:**
- `email`: Valid email address (required)
- `password`: Minimum 8 characters (required)
- `firstName`: 1-100 characters (required)
- `lastName`: 1-100 characters (required)
- `role`: ADMIN or STAFF (optional, defaults to STAFF)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newstaff@example.com",
    "firstName": "New",
    "lastName": "Staff",
    "role": "STAFF",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Staff member created successfully"
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `409` - Email already exists

---

### Update Staff

**PUT** `/staff/:id`

Updates a staff member's information. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "updated@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "role": "ADMIN"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "updated@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Staff member updated successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found

---

### Delete Staff

**DELETE** `/staff/:id`

Deletes a staff member. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Staff member deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found

---

### Get Staff Statistics

**GET** `/staff/statistics`

Returns statistics about staff members. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "admins": 3,
    "staff": 22
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

---

## Attendance Endpoints

### Check In

**POST** `/attendance/check-in`

Marks attendance for the current user for today.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "date": "2024-01-01" // Optional, defaults to today
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "staffId": "uuid",
    "date": "2024-01-01",
    "checkInTime": "09:00:00",
    "checkOutTime": null,
    "status": "PRESENT",
    "createdAt": "2024-01-01T09:00:00.000Z"
  },
  "message": "Checked in successfully"
}
```

**Status Codes:**
- `201` - Created
- `400` - Already checked in
- `401` - Unauthorized

---

### Check Out

**POST** `/attendance/check-out`

Marks checkout for the current user for today.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "date": "2024-01-01" // Optional, defaults to today
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "staffId": "uuid",
    "date": "2024-01-01",
    "checkInTime": "09:00:00",
    "checkOutTime": "17:00:00",
    "status": "PRESENT",
    "updatedAt": "2024-01-01T17:00:00.000Z"
  },
  "message": "Checked out successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Not checked in / already checked out
- `401` - Unauthorized

---

### Get Today's Status

**GET** `/attendance/today`

Returns today's attendance status for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hasCheckedIn": true,
    "hasCheckedOut": false,
    "attendance": {
      "id": "uuid",
      "staffId": "uuid",
      "date": "2024-01-01",
      "checkInTime": "09:00:00",
      "checkOutTime": null,
      "status": "PRESENT"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Get Attendance List

**GET** `/attendance`

Returns attendance records. Admins see all records, staff see only their own.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `staffId` (optional): Filter by staff ID (admin only)
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)
- `status` (optional): Filter by status (PRESENT, LATE, ABSENT)

**Example:**
```
GET /attendance?startDate=2024-01-01&endDate=2024-01-31&status=PRESENT
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "staffId": "uuid",
      "date": "2024-01-01",
      "checkInTime": "09:00:00",
      "checkOutTime": "17:00:00",
      "status": "PRESENT",
      "createdAt": "2024-01-01T09:00:00.000Z",
      "updatedAt": "2024-01-01T17:00:00.000Z",
      "staff": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Get Attendance Statistics

**GET** `/attendance/statistics`

Returns attendance statistics for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDays": 20,
    "present": 18,
    "late": 1,
    "absent": 1,
    "presentPercentage": 90.0
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Create Attendance (Admin)

**POST** `/attendance`

Manually creates an attendance record. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "staffId": "uuid",
  "date": "2024-01-01",
  "checkInTime": "09:00", // Optional, HH:MM format
  "checkOutTime": "17:00", // Optional, HH:MM format
  "status": "PRESENT" | "LATE" | "ABSENT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "staffId": "uuid",
    "date": "2024-01-01",
    "checkInTime": "09:00:00",
    "checkOutTime": "17:00:00",
    "status": "PRESENT",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Attendance record created successfully"
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `409` - Record already exists for this date

---

### Update Attendance (Admin)

**PUT** `/attendance/:id`

Updates an attendance record. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "checkInTime": "09:00:00", // Optional, HH:MM:SS format
  "checkOutTime": "17:00:00", // Optional, HH:MM:SS format
  "status": "LATE" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "staffId": "uuid",
    "date": "2024-01-01",
    "checkInTime": "09:00:00",
    "checkOutTime": "17:00:00",
    "status": "LATE",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Attendance record updated successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found

---

### Delete Attendance (Admin)

**DELETE** `/attendance/:id`

Deletes an attendance record. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance record deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Validation error"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "No token provided"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added in a production environment.

## CORS

The backend is configured to accept requests from:
```
http://localhost:3000
```

Configure the backend `CLIENT_URL` environment variable to change this.

---

## Notes

1. All timestamps are in ISO 8601 format
2. All dates are in YYYY-MM-DD format
3. All times are in HH:MM:SS format
4. UUID format is used for all IDs
5. Role-based access is enforced at the API level
6. Staff can only view/modify their own records (except admins)

---

**Last Updated:** January 2026
