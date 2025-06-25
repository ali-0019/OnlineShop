# Online Shop API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Response data (optional)
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Login User

**POST** `/auth/login`

Request Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

### Get Current User

**GET** `/auth/me` 🔒

### Update User Details

**PUT** `/auth/updatedetails` 🔒

Request Body:

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  }
}
```

### Update Password

**PUT** `/auth/updatepassword` 🔒

Request Body:

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Product Endpoints

### Get All Products

**GET** `/products`

Query Parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort by field (e.g., 'name', '-price', 'createdAt')
- `category` - Filter by category ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `brand` - Filter by brand
- `keyword` - Search keyword

Example: `/products?page=1&limit=10&sort=-price&category=category_id&minPrice=100&maxPrice=500`

### Search Products

**GET** `/products/search`

Query Parameters:

- `q` - Search query (required)
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `brand` - Filter by brand
- `sort` - Sort order
- `page` - Page number
- `limit` - Items per page

Example: `/products/search?q=phone&category=electronics&minPrice=100&maxPrice=1000`

### Get Featured Products

**GET** `/products/featured`

### Get Single Product

**GET** `/products/:id`

### Create Product

**POST** `/products` 🔒 👑

Request Body:

```json
{
  "name": "iPhone 13 Pro",
  "description": "Latest Apple iPhone with A15 Bionic chip",
  "shortDescription": "Premium smartphone with advanced camera system",
  "price": 999,
  "originalPrice": 1099,
  "discount": 9,
  "images": [
    {
      "url": "/images/products/iphone-13-pro.jpg",
      "alt": "iPhone 13 Pro",
      "isPrimary": true
    }
  ],
  "category": "category_id",
  "brand": "Apple",
  "sku": "IPHONE13PRO-128",
  "stock": 50,
  "isFeatured": true,
  "specifications": [
    {
      "name": "Storage",
      "value": "128GB"
    }
  ],
  "tags": ["smartphone", "apple", "ios"]
}
```

### Update Product

**PUT** `/products/:id` 🔒 👑

### Delete Product

**DELETE** `/products/:id` 🔒 👑

### Add Product Review

**POST** `/products/:id/reviews` 🔒

Request Body:

```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

### Get Product Reviews

**GET** `/products/:id/reviews`

---

## Category Endpoints

### Get All Categories

**GET** `/categories`

### Get Category Tree

**GET** `/categories/tree`

### Get Category by Slug

**GET** `/categories/slug/:slug`

### Get Single Category

**GET** `/categories/:id`

### Get Category Products

**GET** `/categories/:id/products`

Query Parameters:

- `page` - Page number
- `limit` - Items per page
- `sort` - Sort order
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `brand` - Filter by brand

### Create Category

**POST** `/categories` 🔒 👑

Request Body:

```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "image": "/images/categories/electronics.jpg",
  "parentCategory": "parent_category_id",
  "sortOrder": 1
}
```

### Update Category

**PUT** `/categories/:id` 🔒 👑

### Delete Category

**DELETE** `/categories/:id` 🔒 👑

---

## Cart Endpoints

### Get User Cart

**GET** `/cart` 🔒

### Get Cart Item Count

**GET** `/cart/count` 🔒

### Add Item to Cart

**POST** `/cart` 🔒

Request Body:

```json
{
  "productId": "product_id",
  "quantity": 2
}
```

### Update Cart Item

**PUT** `/cart/:itemId` 🔒

Request Body:

```json
{
  "quantity": 3
}
```

### Remove Item from Cart

**DELETE** `/cart/:itemId` 🔒

### Clear Cart

**DELETE** `/cart` 🔒

---

## Order Endpoints

### Create Order

**POST** `/orders` 🔒

Request Body:

```json
{
  "orderItems": [
    {
      "product": "product_id",
      "name": "Product Name",
      "image": "/images/product.jpg",
      "price": 99.99,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "credit_card",
  "itemsPrice": 199.98,
  "taxPrice": 20.0,
  "shippingPrice": 10.0,
  "totalPrice": 229.98,
  "notes": "Please handle with care"
}
```

### Get User Orders

**GET** `/orders` 🔒

Query Parameters:

- `page` - Page number
- `limit` - Items per page

### Get Single Order

**GET** `/orders/:id` 🔒

### Update Order to Paid

**PUT** `/orders/:id/pay` 🔒

Request Body:

```json
{
  "id": "payment_id",
  "status": "completed",
  "update_time": "2023-01-01T00:00:00Z",
  "email_address": "payer@example.com"
}
```

### Cancel Order

**PUT** `/orders/:id/cancel` 🔒

---

## Admin Order Endpoints

### Get All Orders

**GET** `/orders/admin/all` 🔒 👑

Query Parameters:

- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status
- `isPaid` - Filter by payment status (true/false)

### Get Order Statistics

**GET** `/orders/admin/stats` 🔒 👑

### Update Order Status

**PUT** `/orders/:id/status` 🔒 👑

Request Body:

```json
{
  "status": "shipped",
  "trackingNumber": "1234567890",
  "notes": "Package shipped via FedEx"
}
```

---

## User Management Endpoints

### Get User Profile

**GET** `/users/profile` 🔒

### Update User Profile

**PUT** `/users/profile` 🔒

Request Body:

```json
{
  "name": "Updated Name",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  }
}
```

### Delete User Account

**DELETE** `/users/profile` 🔒

### Get All Users

**GET** `/users` 🔒 👑

Query Parameters:

- `page` - Page number
- `limit` - Items per page
- `role` - Filter by role
- `isActive` - Filter by active status

### Get Single User

**GET** `/users/:id` 🔒 👑

### Update User

**PUT** `/users/:id` 🔒 👑

### Delete User

**DELETE** `/users/:id` 🔒 👑

---

## Status Codes and Error Handling

### Success Responses

- `200 OK` - Request successful
- `201 Created` - Resource created successfully

### Error Responses

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Validation errors (if applicable)
}
```

---

## Pagination

Paginated responses include pagination metadata:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "prev": null,
      "next": {
        "page": 2,
        "limit": 10
      }
    }
  }
}
```

---

## Legends

- 🔒 - Requires authentication
- 👑 - Requires admin role

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP
- **Response**: 429 Too Many Requests when limit exceeded

---

## CORS

The API supports CORS for cross-origin requests from the frontend application.

---

## Security Headers

The API includes security headers via Helmet middleware for protection against common vulnerabilities.
