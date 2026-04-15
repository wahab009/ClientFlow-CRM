# ClientFlow CRM - Phase 2 API Documentation

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Client Management](#client-management)
4. [Task Management](#task-management)
5. [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Register User
Create a new user account.

**Endpoint:** `POST /api/users/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2026-04-13T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

### Login User
Authenticate and receive a JWT token.

**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

## User Management

### Get Current User Profile
Retrieve the authenticated user's profile.

**Endpoint:** `GET /api/users/me`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Current user",
  "data": {
    "id": "uuid",
    "role": "USER"
  }
}
```

---

### Get All Users (Admin Only)
List all users in the system.

**Endpoint:** `GET /api/users`

**Headers:** `Authorization: Bearer <admin_token>`

**Success Response (200):**
```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2026-04-13T10:00:00Z",
      "updatedAt": "2026-04-13T10:00:00Z",
      "_count": {
        "clients": 5,
        "tasks": 12
      }
    }
  ],
  "total": 1
}
```

---

### Get User by ID
Retrieve a specific user's details.

**Endpoint:** `GET /api/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2026-04-13T10:00:00Z",
    "updatedAt": "2026-04-13T10:00:00Z",
    "clients": [
      {
        "id": "uuid",
        "name": "Acme Corp",
        "email": "contact@acme.com",
        "status": "active"
      }
    ],
    "tasks": [
      {
        "id": "uuid",
        "title": "Schedule meeting",
        "status": "pending"
      }
    ]
  }
}
```

---

### Update User Profile
Update user information (users can only update their own profile, admins can update any).

**Endpoint:** `PUT /api/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "USER",
    "updatedAt": "2026-04-13T10:30:00Z"
  }
}
```

---

### Delete User (Admin Only)
Remove a user account from the system.

**Endpoint:** `DELETE /api/users/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Client Management

### Create Client
Create a new client record.

**Endpoint:** `POST /api/clients`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "company": "Acme Corp",
  "status": "active"
}
```

**Success Response (201):**
```json
{
  "message": "Client created successfully",
  "data": {
    "id": "uuid",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "company": "Acme Corp",
    "status": "active",
    "assignedTo": "uuid",
    "createdAt": "2026-04-13T10:00:00Z",
    "updatedAt": "2026-04-13T10:00:00Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Get All Clients
List clients (users see only their assigned clients, admins see all).

**Endpoint:** `GET /api/clients`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` - Filter by status (active, inactive, etc.)

**Example:** `GET /api/clients?status=active`

**Success Response (200):**
```json
{
  "message": "Clients retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "company": "Acme Corp",
      "status": "active",
      "assignedTo": "uuid",
      "createdAt": "2026-04-13T10:00:00Z",
      "updatedAt": "2026-04-13T10:00:00Z",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "tasks": [
        {
          "id": "uuid",
          "title": "Schedule meeting",
          "status": "pending"
        }
      ]
    }
  ],
  "total": 1
}
```

---

### Get Client by ID
Retrieve a specific client's details with their tasks.

**Endpoint:** `GET /api/clients/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Client retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "company": "Acme Corp",
    "status": "active",
    "assignedTo": "uuid",
    "createdAt": "2026-04-13T10:00:00Z",
    "updatedAt": "2026-04-13T10:00:00Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tasks": [
      {
        "id": "uuid",
        "title": "Schedule meeting",
        "description": "Call with stakeholders",
        "status": "pending",
        "priority": "high",
        "createdAt": "2026-04-13T10:00:00Z"
      }
    ]
  }
}
```

---

### Update Client
Modify client information.

**Endpoint:** `PUT /api/clients/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Acme Corp Updated",
  "status": "inactive",
  "phone": "+1-555-9999"
}
```

**Success Response (200):**
```json
{
  "message": "Client updated successfully",
  "data": { }
}
```

---

### Delete Client
Remove a client and all associated tasks.

**Endpoint:** `DELETE /api/clients/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Client deleted successfully"
}
```

---

## Task Management

### Create Task
Create a new task (optionally associated with a client).

**Endpoint:** `POST /api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Schedule meeting",
  "description": "Call with stakeholders",
  "status": "pending",
  "priority": "high",
  "clientId": "uuid"
}
```

**Success Response (201):**
```json
{
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "Schedule meeting",
    "description": "Call with stakeholders",
    "status": "pending",
    "priority": "high",
    "userId": "uuid",
    "clientId": "uuid",
    "createdAt": "2026-04-13T10:00:00Z",
    "updatedAt": "2026-04-13T10:00:00Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "client": {
      "id": "uuid",
      "name": "Acme Corp"
    }
  }
}
```

---

### Get All Tasks
List tasks (users see only their tasks, admins see all).

**Endpoint:** `GET /api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` - Filter by status (pending, completed, etc.)
- `priority` - Filter by priority (low, medium, high)
- `clientId` - Filter by client

**Example:** `GET /api/tasks?status=pending&priority=high`

**Success Response (200):**
```json
{
  "message": "Tasks retrieved successfully",
  "data": [],
  "total": 0
}
```

---

### Get Task by ID
Retrieve a specific task's details.

**Endpoint:** `GET /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Task retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Schedule meeting",
    "description": "Call with stakeholders",
    "status": "pending",
    "priority": "high",
    "userId": "uuid",
    "clientId": "uuid",
    "createdAt": "2026-04-13T10:00:00Z",
    "updatedAt": "2026-04-13T10:00:00Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "client": {
      "id": "uuid",
      "name": "Acme Corp",
      "email": "contact@acme.com"
    }
  }
}
```

---

### Update Task
Modify task details.

**Endpoint:** `PUT /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "completed",
  "priority": "low"
}
```

**Success Response (200):**
```json
{
  "message": "Task updated successfully",
  "data": { }
}
```

---

### Delete Task
Remove a task.

**Endpoint:** `DELETE /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Error Handling

### Error Response Format
All errors follow this standard format:

```json
{
  "error": "Error Type",
  "message": "Descriptive error message"
}
```

### Common Error Codes

| Status | Error | Message |
|--------|-------|---------|
| 400 | Bad Request | Missing or invalid required fields |
| 401 | Unauthorized | No token provided or invalid credentials |
| 403 | Forbidden | User lacks required permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists (e.g., email in use) |
| 500 | Internal Server Error | Server error |

### Examples

**Missing Token:**
```
401 Unauthorized
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

**Expired Token:**
```
403 Forbidden
{
  "error": "Forbidden",
  "message": "Invalid or expired token"
}
```

**Resource Not Found:**
```
404 Not Found
{
  "error": "Not Found",
  "message": "Client not found"
}
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/clientflow_crm
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

---

**API Documentation v1.0**  
Last Updated: April 13, 2026
