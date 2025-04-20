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
```bash
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
 ```

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
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   └── package.json         # Backend dependencies
│
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
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