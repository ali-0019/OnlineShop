# Online Shop

A modern e-commerce web application built with React for the frontend and Node.js for the backend.

## Features

- User authentication and account management
- Product browsing and searching
- Shopping cart functionality
- Secure checkout process
- Order history and tracking
- Wishlist management
- Responsive design for all devices

## Tech Stack

### Frontend

- React
- React Router
- SCSS for styling
- React Icons
- Context API for state management

### Backend

- Node.js
- Express
- MongoDB
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

````bash
git clone <repository-url>
cd onlineShop

2. Install dependencies for both frontend and backend
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
````

3. Set up environment variables

   - Create a .env file in the frontend directory
   - Create a .env file in the backend directory
   - Add the necessary environment variables (see .env.example files)

4. Start the development servers

```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend server
cd frontend
npm start
```

5. Open your browser and navigate to http://localhost:3000

## Project Structure

```plaintext
onlineShop/
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # SCSS styles
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── docs/                # API documentation
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── seeder/              # Database seeder
│   ├── utils/               # Utility functions
│   ├── validation/          # Input validation schemas
│   ├── server.js            # Entry point
│   ├── .env.example         # Environment variables example
│   └── package.json         # Backend dependencies
│
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```

## Backend API Endpoints

The backend provides a comprehensive REST API with the following main endpoints:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Products

- `GET /api/products` - Get all products (with filtering, pagination)
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category hierarchy
- `GET /api/categories/:id/products` - Get products by category
- `POST /api/categories` - Create category (Admin)

### Cart

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/pay` - Mark order as paid
- `PUT /api/orders/:id/cancel` - Cancel order

For complete API documentation, see `backend/docs/API.md`

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/onlineshop
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env` file
3. Run the seeder to populate initial data:

```bash
cd backend
npm run seed
```

## Key Features

### Security

- JWT authentication with role-based access control
- Input validation using Joi schemas
- Rate limiting to prevent API abuse
- Data sanitization to prevent NoSQL injection
- Secure password hashing with bcrypt

### Performance

- Database indexing for optimized queries
- Pagination for large datasets
- Efficient filtering and searching
- Caching strategies (ready for implementation)

### Error Handling

- Centralized error handling middleware
- Consistent error response format
- Detailed logging for debugging
- Graceful handling of various error types

## Testing the Backend

You can test the API endpoints using:

- Postman
- Thunder Client (VS Code extension)
- curl commands
- Frontend integration

Example curl command:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## Deployment

### Frontend

The frontend can be deployed to services like Vercel, Netlify, or GitHub Pages.

```bash
cd frontend
npm run build
```

### Backend

The backend can be deployed to services like Heroku, DigitalOcean, or AWS.

## Contributing

1. Fork the repository
2. Create your feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add some amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React
- Node.js
- Express
- MongoDB
