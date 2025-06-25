# Online Shop Backend

Node.js/Express backend for the Online Shop e-commerce application.

## Features

- **Authentication & Authorization**: JWT based authentication with role-based access control
- **User Management**: User registration, login, profile management
- **Product Management**: CRUD operations for products with search and filtering
- **Category Management**: Hierarchical categories with subcategories
- **Shopping Cart**: Add, update, remove items from cart
- **Order Management**: Complete order processing and tracking
- **Admin Dashboard**: Administrative functions for managing the store
- **Security**: Rate limiting, input validation, data sanitization
- **Error Handling**: Centralized error handling with detailed logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting, Mongo Sanitize
- **Password Hashing**: bcryptjs
- **Logging**: Morgan

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get single user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Products

- `GET /api/products` - Get all products (with pagination & filtering)
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/:id/reviews` - Get product reviews

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category tree structure
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/slug/:slug` - Get category by slug
- `GET /api/categories/:id/products` - Get products by category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart

- `GET /api/cart` - Get user cart
- `GET /api/cart/count` - Get cart item count
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `GET /api/orders/admin/stats` - Get order statistics (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

## Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/onlineshop
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

5. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Environment Variables

| Variable                  | Description               | Default                 |
| ------------------------- | ------------------------- | ----------------------- |
| `NODE_ENV`                | Environment mode          | `development`           |
| `PORT`                    | Server port               | `5000`                  |
| `MONGODB_URI`             | MongoDB connection string | Required                |
| `JWT_SECRET`              | JWT secret key            | Required                |
| `JWT_EXPIRE`              | JWT expiration time       | `7d`                    |
| `CORS_ORIGIN`             | CORS allowed origin       | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window         | `900000`                |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window   | `100`                   |

## Data Models

### User

- name, email, password (hashed)
- role (user/admin)
- address, phone
- timestamps

### Product

- name, description, price
- images, category, brand, SKU
- stock, specifications
- reviews and ratings
- timestamps

### Category

- name, description, slug
- parent category (for hierarchy)
- timestamps

### Cart

- user reference
- items (product, quantity, price)
- totals calculation

### Order

- user, order items
- shipping address
- payment information
- status tracking
- timestamps

## Security Features

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevents abuse of API endpoints
- **Input Validation**: Joi schema validation
- **Data Sanitization**: Prevents NoSQL injection
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers

## Error Handling

The API uses a centralized error handling system that:

- Catches all errors and returns consistent JSON responses
- Logs errors for debugging
- Handles different types of errors (validation, database, JWT, etc.)
- Returns appropriate HTTP status codes

## Response Format

All API responses follow this structure:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Response data
}
```

## Development

### Adding New Routes

1. Create controller function in `/controllers`
2. Add validation schema in `/validation`
3. Define route in `/routes`
4. Import route in `server.js`

### Database Seeding

Run the seeder to populate initial data:

```bash
npm run seed
```

### Testing

Run tests with:

```bash
npm test
```

## Deployment

1. Set environment variables in production
2. Build and deploy to your platform (Heroku, AWS, etc.)
3. Ensure MongoDB is accessible from production environment
4. Update CORS settings for production frontend URL

## Contributing

1. Follow existing code structure and naming conventions
2. Add proper validation for new endpoints
3. Include error handling in controllers
4. Update documentation for new features
5. Add tests for new functionality
