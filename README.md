# SmartBrain API Documentation

The SmartBrain API is a backend application designed to support a face recognition web app. It provides endpoints for user management, image submissions, and face detection using the Clarifai API.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Running the Application](#running-the-application)
4. [API Endpoints](#api-endpoints)
5. [Database Setup](#database-setup)
6. [Clarifai API Integration](#clarifai-api-integration)
7. [Environment Variables](#environment-variables)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [License](#license)

## 1. Installation

To set up the SmartBrain API locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/C0des-by-SAGAR/smart-brain-api.git
   cd smart-brain-api
   ```

2. **Install dependencies:**

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```bash
   npm install
   ```

## 2. Configuration

Before running the application, configure the following:

1. **Database Credentials:**

   Update the database connection settings in `server.js` to match your PostgreSQL configuration.

2. **Clarifai API Key:**

   Obtain a Clarifai API key by creating an account at [Clarifai](https://www.clarifai.com/). Add this key to the appropriate configuration file or environment variable as described in the [Clarifai API Integration](#clarifai-api-integration) section.

## 3. Running the Application

To start the server, execute:

```bash
npm start
```

The server will run on the port specified in your configuration (default is `3000`).

## 4. API Endpoints

The SmartBrain API provides the following endpoints:

- **POST `/signin`**: Authenticates a user and returns a success message along with user data.

- **POST `/register`**: Registers a new user and returns the created user object.

- **GET `/profile/:id`**: Retrieves the profile of a user by their ID.

- **PUT `/image`**: Updates the image count for a user and returns the updated count.

- **POST `/imageurl`**: Handles image URL submissions for face detection.

## 5. Database Setup

The application uses PostgreSQL as its database. Ensure PostgreSQL is installed and running on your machine.

1. **Create a new database:**

   ```sql
   CREATE DATABASE smartbrain;
   ```

2. **Create the necessary tables:**

   Use the following SQL commands to set up the required tables:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100),
     email TEXT UNIQUE NOT NULL,
     entries BIGINT DEFAULT 0,
     joined TIMESTAMP NOT NULL
   );

   CREATE TABLE login (
     id SERIAL PRIMARY KEY,
     hash TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL
   );
   ```

## 6. Clarifai API Integration

The SmartBrain API integrates with the Clarifai API for face detection.

1. **Obtain an API key:**

   Sign up at [Clarifai](https://www.clarifai.com/) to get your API key.

2. **Configure the API key:**

   Add your Clarifai API key to the environment variables or directly in the `controllers/image.js` file. It's recommended to use environment variables for better security.

## 7. Environment Variables

Create a `.env` file in the root directory to manage sensitive information. Add the following variables:

```env
DATABASE_URL=your_postgresql_connection_string
CLARIFAI_API_KEY=your_clarifai_api_key
PORT=3000
```

Replace `your_postgresql_connection_string` and `your_clarifai_api_key` with your actual credentials.

## 8. Error Handling

The API includes basic error handling for database operations and external API calls. Ensure to handle errors gracefully in your client application as well.

## 9. Security Considerations

- **Password Hashing:** User passwords are hashed using bcrypt before storing in the database.

- **Environment Variables:** Store sensitive information like API keys and database credentials in environment variables.

- **Input Validation:** Implement input validation to prevent SQL injection and other attacks.

## 10. Deployment

To deploy the SmartBrain API, consider using platforms like [Render](https://render.com/) or [Heroku](https://www.heroku.com/). Ensure to set the necessary environment variables and configure your database accordingly.

## 11. Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code follows the project's coding standards and includes appropriate tests.

For a visual demonstration of the SmartBrain application, you can watch the following video:

 
