# Quick Start Guide

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Either:
   - Local installation - [Download](https://www.mongodb.com/try/download/community)
   - MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/atlas)
3. **Git** - [Download](https://git-scm.com/)

## Backend Setup (5 minutes)

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your settings:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/onlineshop
   JWT_SECRET=your_very_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB** (if using local installation):

   ```bash
   # Windows
   mongod

   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Seed the database with sample data:**

   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

✅ **Backend is now running at:** `http://localhost:5000`

## Test the API

1. **Health Check:**

   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register a user:**

   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Get products:**
   ```bash
   curl http://localhost:5000/api/products
   ```

## Admin Access

The seeder creates an admin user:

- **Email:** `admin@onlineshop.com`
- **Password:** `admin123`

Use these credentials to access admin features.

## Next Steps

1. **Frontend Setup:** Navigate to `../frontend` and follow the frontend setup instructions
2. **API Documentation:** Check `docs/API.md` for complete API reference
3. **Customization:** Modify models, add new endpoints, or adjust business logic as needed

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check the connection string in `.env`
- For Atlas, ensure IP whitelist is configured

### Port Already in Use

- Change the `PORT` in `.env` file
- Or kill the process using the port:

  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -ti:5000 | xargs kill
  ```

### Module Not Found Errors

- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Development Commands

```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm run seed     # Populate database with sample data
npm run seed:destroy  # Clear all data from database
npm run lint     # Run code linting
npm test         # Run tests (when implemented)
```

## Project Structure

```
backend/
├── config/         # Database and app configuration
├── controllers/    # Route handlers and business logic
├── docs/          # API documentation
├── middleware/    # Custom Express middleware
├── models/        # MongoDB/Mongoose models
├── routes/        # API route definitions
├── seeder/        # Database seeding scripts
├── utils/         # Utility functions and helpers
├── validation/    # Input validation schemas
├── server.js      # Application entry point
├── .env           # Environment variables
└── package.json   # Dependencies and scripts
```

## Ready to Build! 🚀

Your backend is now ready for development. The API provides all the essential e-commerce functionality including user management, product catalog, shopping cart, and order processing.
