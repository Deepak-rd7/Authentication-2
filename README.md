# MERN Authentication Project

This project is a full-stack MERN (MongoDB, Express, React, Node.js) application that provides user authentication features including registration, login, email verification, and password reset.



## Features

- User Registration
- User Login
- Email Verification
- Password Reset
- Protected Routes

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router, React Toastify
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer
- **Other**: ESLint, PostCSS

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install dependencies for both client and server:

```sh
cd client
npm install
cd ../server
npm install
```

3. Set up environment variables:

- Create a `.env` file in the `client` directory with the following content:

```
VITE_BACKEND_URL=http://localhost:3000
```

- Create a `.env` file in the `server` directory with the following content:

```
MONGODB_URL=your-mongodb-url
PORT=3000
JWT_SECRET_KEY=your-secret-key
NODE_ENV=development
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SENDER_EMAIL=your-sender-email
```

### Running the Application

1. Start the backend server:

```sh
cd server
npm start
```

2. Start the frontend development server:

```sh
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`.

## Project Structure Details

### Client

- **`src/App.jsx`**: Main application component with routes for different pages.
- **`src/context/AppContext.jsx`**: Context provider for managing global state.
- **`src/pages`**: Contains different pages like `Login`, `Home`, `EmailVerify`, and `ResetPassword`.
- **`src/components`**: Contains reusable components like `Header` and `Navbar`.
- **`src/assets`**: Contains static assets like images and icons.

### Server

- **`server.js`**: Entry point for the backend server.
- **`config`**: Contains configuration files for MongoDB and Nodemailer.
- **`controllers`**: Contains controller functions for handling authentication and user-related operations.
- **`middleware`**: Contains middleware for user authentication.
- **`models`**: Contains Mongoose models for MongoDB collections.
- **`routes`**: Contains route definitions for authentication and user-related endpoints.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Nodemailer](https://nodemailer.com/)
