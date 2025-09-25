# Inspiration BOLT Backend API

A comprehensive and secure backend API for managing events, user authentication, and points system with separate student and organization management.

## 🔒 **Security Features**

- **Separate User Models**: Students and Organizations have completely separate databases
- **Email Validation**: Only registered users can login - "Sign up first" protection
- **Role-based Access Control**: Strict permissions for different user types
- **JWT Authentication**: Secure token-based authentication with role encoding
- **Account Status Tracking**: Active/inactive account management
- **Password Security**: Bcrypt hashing with salt

## 🏗️ **Database Schema**

### **Student Model (User)**
```javascript
{
  _id: ObjectId,
  name: String (max 50 chars),
  email: String (unique, lowercase),
  password: String (hashed, min 6 chars),
  studentId: String (unique identifier),
  points: Number (default: 0),
  totalEvents: Number (default: 0),
  completedEvents: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  lastLogin: Date
}
```

### **Organization Model**
```javascript
{
  _id: ObjectId,
  name: String (max 100 chars),
  email: String (unique, lowercase),
  password: String (hashed, min 6 chars),
  organizationId: String (unique identifier),
  description: String (max 500 chars),
  address: { street, city, state, zipCode, country },
  phone: String (validated format),
  website: String (validated URL),
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  totalEvents: Number (default: 0),
  totalParticipants: Number (default: 0),
  createdAt: Date,
  lastLogin: Date
}
```

### **Event Model**
```javascript
{
  _id: ObjectId,
  title: String (max 100 chars),
  description: String (max 1000 chars),
  date: Date,
  location: String (max 200 chars),
  points: Number (1-1000),
  maxParticipants: Number (optional),
  organization: ObjectId (ref: Organization),
  participants: [{
    user: ObjectId (ref: User),
    status: enum ['registered', 'attended', 'completed', 'cancelled'],
    registeredAt: Date,
    completedAt: Date
  }],
  category: enum ['community_service', 'education', 'environment', 'health', 'arts', 'sports', 'other'],
  isActive: Boolean (default: true),
  isCompleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 **API Endpoints**

### **Student Authentication (`/api/v1/auth`)**

#### POST `/register/student`
Register a new student
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "studentId": "STU001"
}
```

#### POST `/login/student`
Login as a student
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **Organization Authentication (`/api/v1/auth`)**

#### POST `/register/organization`
Register a new organization
```json
{
  "name": "Community Service Org",
  "email": "org@example.com",
  "password": "password123",
  "organizationId": "ORG001",
  "description": "We organize community events",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "phone": "+1234567890",
  "website": "https://example.com"
}
```

#### POST `/login/organization`
Login as an organization
```json
{
  "email": "org@example.com",
  "password": "password123"
}
```

### **Protected Routes (All require JWT token)**

#### GET `/me`
Get current user/organization profile

#### PUT `/update-profile`
Update profile information

#### PUT `/change-password`
Change password
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### GET `/points` (Students only)
Get student's points and event statistics

### **Event Management (`/api/v1/events`)**

#### GET `/`
Get all active events (public)

#### POST `/` (Organizations only)
Create new event
```json
{
  "title": "Community Service Day",
  "description": "Join us for volunteering",
  "date": "2024-01-20T09:00:00.000Z",
  "location": "Central Park",
  "points": 25,
  "maxParticipants": 50,
  "category": "community_service"
}
```

#### GET `/:id`
Get specific event details (public)

#### PUT `/:id` (Organizations only)
Update event (must be event owner)

#### DELETE `/:id` (Organizations only)
Delete event (must be event owner)

#### PUT `/:id/register` (Students only)
Register for an event

#### PUT `/:id/attendance` (Organizations only)
Mark attendance for participants
```json
{
  "userId": "user_id_here",
  "status": "completed"
}
```

#### GET `/organization/:id`
Get all events by a specific organization (public)

#### GET `/my-events` (Students only)
Get events registered by current user

## 🔐 **Authentication Flow**

1. **Registration**: User/Organization signs up with unique email and ID
2. **Login**: System checks if email exists in respective database
3. **Validation**: If email not found → "Sign up first" message
4. **Password Check**: If email exists, verify password
5. **Token Generation**: JWT token with user ID and role
6. **Access Control**: Role-based permissions for all protected routes

## 🛡️ **Security Measures**

- **Email Uniqueness**: Each email can only be used once per user type
- **ID Uniqueness**: Student ID and Organization ID must be unique
- **Account Status**: Inactive accounts cannot login
- **Role Validation**: JWT tokens include role for authorization
- **Input Validation**: All inputs are validated and sanitized
- **Password Hashing**: Bcrypt with salt for secure storage

## 📊 **Points System**

- Students earn points by completing events
- Points are automatically awarded when status changes to "completed"
- Points are tracked per user with event completion history
- Organization can mark attendance and award points

## 🚀 **Setup Instructions**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inspiration_bolt
   JWT_SECRET=your_secure_jwt_secret_here_make_it_long
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start MongoDB service**

4. **Run the server:**
   ```bash
   npm run dev
   ```

## 🧪 **Testing**

Test database connection:
```bash
node test-db.js
```

## 🔍 **Error Handling**

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## 📈 **Features**

- **Real-time Updates**: Event counts, participant tracking
- **Flexible Events**: Optional participant limits, categories
- **Comprehensive Tracking**: User statistics, organization metrics
- **Secure Operations**: All operations require proper authentication
- **Data Integrity**: Referential integrity between models
