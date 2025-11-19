# User Management System

A full-stack user management system with a Node.js/SQLite backend and React/TypeScript frontend.

## Live URLs

- **Frontend**: https://sav-test.vercel.app
- **Backend**: https://sav-test-production.up.railway.app

## Setup Instructions for Local Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (or pnpm)

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### Database

The backend uses an SQLite database (`data.db`) located in the `backend` directory. The database should already be present with the required schema.

## How to Run the Application

### Backend
```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3001`

### Frontend
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

**Note**: Start the backend server before the frontend.

## How to Run Tests

### Frontend Tests
```bash
cd frontend
npm test
```

This will run the test suite using Vitest. The frontend includes tests for components and hooks.

## Building

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### User Endpoints

#### `GET /users`
Returns a paginated list of users with address information.

**Query Parameters:**
- `pageNumber` (number, optional): Page number (0-indexed). Default: 0
- `pageSize` (number, optional): Number of users per page. Default: 4

**Example:**
```
GET /users?pageNumber=0&pageSize=10
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "address": {
      "id": "1",
      "user_id": "1",
      "street": "123 Main St",
      "state": "CA",
      "city": "San Francisco",
      "zipcode": "94102"
    }
  }
]
```

#### `GET /users/count`
Returns the total number of users.

**Response:**
```json
{
  "count": 100
}
```

#### `GET /users/:id`
Returns a single user by ID with address information.

**Parameters:**
- `id` (number, required): The ID of the user to retrieve

**Example:**
```
GET /users/1
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "address": {
    "id": "1",
    "user_id": "1",
    "street": "123 Main St",
    "state": "California",
    "city": "San Francisco",
    "zipcode": "94102"
  }
}
```

**Errors:**
- `400`: Invalid user ID
- `404`: User not found
- `500`: Internal server error

### Post Endpoints

#### `GET /posts`
Returns posts filtered by user ID.

**Query Parameters:**
- `userId` (string, required): The ID of the user whose posts to retrieve

**Example:**
```
GET /posts?userId=1
```

**Response:**
```json
[
  {
    "id": "1",
    "userId": "1",
    "title": "Post Title",
    "body": "Post body content"
  }
]
```

**Error (400):**
```json
{
  "error": "userId is required"
}
```

#### `POST /posts`
Creates a new post.

**Request Body:**
```json
{
  "title": "Post Title",
  "body": "Post body content",
  "userId": "1"
}
```

**Response (201):**
```json
{
  "id": "2",
  "userId": "1",
  "title": "Post Title",
  "body": "Post body content"
}
```

**Errors:**
- `400`: Missing or invalid title, body, or userId
- `500`: Internal server error

#### `DELETE /posts/:id`
Deletes a post by ID.

**Example:**
```
DELETE /posts/1
```

**Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

**Errors:**
- `400`: Post ID is required
- `404`: Post not found
- `500`: Internal server error

## Troubleshooting

### Port Already in Use
Change the port in `backend/config/default.json` or stop the process using port 3001.

### Database Not Found
Ensure `data.db` exists in the `backend` directory.

### API Connection Errors
- Verify backend is running on port 3001
- Check `VITE_API_BASE_URL` in `frontend/.env` matches backend URL
- Restart frontend dev server after changing `.env`
