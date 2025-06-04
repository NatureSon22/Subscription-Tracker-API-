# 🚀 Backend Development Essentials

**Date: June 2, 2025**

---

This document summarizes essential concepts for backend development, primarily focusing on **Node.js, Express, and MongoDB**. While some details are specific to these technologies, many of the principles and practices discussed here are broadly applicable to various backend frameworks and databases.

---

## 1. Project Initialization & Linting

Getting your project set up and ensuring code quality from the start.

### 📦 Initialize Your Node.js Application

To begin your backend project, you'll first set up a `package.json` file, which manages your project's dependencies and scripts.

- Open your terminal in your project's root directory and type:
  ```bash
  npm init -y
  ```
  - The `-y` flag automatically accepts all the default settings, quickly generating your `package.json` file.

### 🛡️ Set Up ESLint for Code Quality

ESLint helps you find and fix problems in your JavaScript code, ensuring consistent style and preventing common errors.

- In your terminal, run:
  ```bash
  npm init @eslint/config@latest
  ```
  - This command will guide you through a series of questions to configure ESLint according to your project's needs.

---

## 2. 🌍 Setting Up Environment Variables (`.env`)

Environment variables are crucial for managing configuration settings that change between different deployment environments (e.g., development, production) and for keeping sensitive information (like API keys) out of your codebase.

### 📁 Folder Structure & `dotenv` Configuration

It's a good practice to load your environment variables early in your application's lifecycle.

1.  **Install `dotenv`:** First, install the `dotenv` package, which loads environment variables from `.env` files into `process.env`.
    ```bash
    npm install dotenv
    ```
2.  **Create a Configuration File (Optional but Recommended):**
    While you can configure `dotenv` directly in your main entry file (e.g., `app.js` or `server.js`), creating a dedicated `config` folder and a file like `config/env.js` (or `config/index.js`) can keep things organized.

    - **Example `config/env.js`:**

      ```javascript
      // config/env.js
      import dotenv from "dotenv"; // Use 'require' if not using ES modules

      // Dynamically load the correct .env file based on the NODE_ENV
      // If NODE_ENV is not set, it defaults to 'development'.
      dotenv.config({
        path: `.env.${process.env.NODE_ENV || "development"}.local`,
      });

      // Export the environment variables you need
      export const PORT = process.env.PORT;
      export const DATABASE_URL = process.env.DATABASE_URL;
      // Add any other variables you need here
      ```

    - **Usage in your main file (e.g., `server.js`):**

      ```javascript
      // server.js
      import { PORT } from "./config/env.js"; // Adjust path as needed
      // const { PORT } = require('./config/env'); // For CommonJS

      // Your Express app setup
      // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
      ```

### 📄 Create Environment Files

These files will store your actual key-value pairs for environment variables.

1.  **In your project's root folder**, create these two files:

    - `.env.production.local`
    - `.env.development.local`

    - **Example `.env.development.local`:**
      ```
      PORT=3000
      DATABASE_URL=mongodb://localhost:27017/mydevdb
      SECRET_KEY=mydevsecret
      ```
    - **Example `.env.production.local`:**
      ```
      PORT=8080
      DATABASE_URL=mongodb://production-server/myproddb
      SECRET_KEY=a_very_strong_production_secret_key
      ```

### 🔐 Secure Your Environment Files

It's critical to prevent your environment files from being committed to version control (like Git), as they often contain sensitive information.

1.  **Add to `.gitignore`:** In your `.gitignore` file (also in the root folder), add the following line:
    ```
    .env.*.local
    ```
    - This ensures that any file starting with `.env.` and ending with `.local` will be ignored by Git.

---

## 3. 🛣️ Creating Routes

Routes define the endpoints of your API and how your application responds to different HTTP requests (GET, POST, PUT, DELETE, etc.).

### 📂 Organize Your Routes

1.  **Create a `/routes` folder** in your project's root directory. This helps keep your routing logic modular and organized.

### 📝 Router Structure

Each major resource or feature (e.g., authentication, users, products) should typically have its own router file.

- Follow this common structure for creating an Express router:

  ```javascript
  // routes/authRoutes.js
  import { Router } from "express"; // Make sure 'express' is installed: npm install express

  const authRouter = Router(); // Create a new router instance

  // Define your routes using HTTP methods (post, get, put, delete, etc.)
  // router.method("path", (request, response) => { callback function })

  authRouter.post("/login", (req, res) => {
    // In a real application, you would handle user authentication here
    res.send({ message: "Login endpoint hit!" });
  });

  authRouter.get("/profile", (req, res) => {
    // This might require authentication middleware
    res.status(200).json({ user: { id: "123", username: "exampleUser" } });
  });

  export default authRouter; // Export the router for use in your main app file
  ```

- **In your main application file (e.g., `server.js` or `app.js`):**

  ```javascript
  // server.js
  import express from "express";
  import authRouter from "./routes/authRoutes.js"; // Adjust path as needed
  // const express = require('express'); // For CommonJS
  // const authRouter = require('./routes/authRoutes'); // For CommonJS

  const app = express();
  app.use(express.json()); // Middleware to parse JSON request bodies

  // Mount the authentication router at a base path
  app.use("/api/auth", authRouter);

  // Other routes or middleware...

  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  ```

---

## 4. 🔗 RESTful API Naming Conventions for Paths

Consistent and clear naming conventions make your API easy to understand and use. These guidelines are based on RESTful principles.

1.  **Use Nouns for Resources:**

    - **Good:** `/users`, `/products`
    - **Bad:** `/getUsers`, `/createProduct` (HTTP methods handle actions)

2.  **Use Plural Nouns for Collections:**

    - **Collections** (lists of resources) should use plural nouns.
    - **Example:** `/users` (represents the collection of all users), `/products` (represents the collection of all products).

3.  **Use Singular Nouns (with ID) for Specific Documents:**

    - To refer to a single instance of a resource (a "document"), use a singular noun followed by its unique identifier (ID).
    - **Example:** `/users/{id}`, `/books/{id}` (e.g., `/users/123`, `/books/isbn-978-0321765723`)

4.  **Nest Sub-Resources Under Their Parent Document:**

    - If a resource is a component or collection of another, nest it.
    - **Example:**
      - `/products/{id}/comments` (all comments for a specific product)
      - `/users/{id}/cart-items` (all items in a specific user's cart)

5.  **Use Hyphens for Multi-Word Resource Names:**

    - For readability, separate words in resource names with hyphens.
    - **Example:** `/user-profiles`, `/blog-posts`
    - **Avoid:** `/userProfiles`, `/blogposts`

6.  **Avoid Deep Nesting (Limit to 2 or 3 Levels):**

    - While nesting is useful, too many levels can make URLs long and hard to manage. Aim for a maximum of 2 or 3 levels.
    - **Generally Acceptable:** `/products/{id}/comments/{commentId}` (3 levels, to get a specific comment for a specific product)
    - **Consider Alternatives for Deeper Nesting:** If you find yourself going deeper, consider if the relationship can be flattened or if a different resource structure would be more appropriate.

7.  **Be Consistent:**
    - The most important rule! Once you choose a convention, stick to it across your entire API. Consistency makes your API predictable and easy to learn.

---

**Date: June 3, 2025**

---

## 5. 🗄️ Connecting to the Database (MongoDB with Mongoose)

Establishing a connection to your database is one of the first critical steps for any data-driven backend application. Here, we'll focus on connecting to MongoDB using Mongoose, a popular ODM (Object Data Modeling) library for Node.js.

### 📂 Folder Structure

1.  Create a `/database` folder in your project's root. This will house your database connection logic.

### 📝 Connection Setup (`mongodb.js`)

Inside the `/database` folder, create a file named `mongodb.js` (or `db.js`) and set up your connection function.

* **Install Mongoose:**
    ```bash
    npm install mongoose
    ```
* **`database/mongodb.js`:**
    ```javascript
    // database/mongodb.js
    import mongoose from 'mongoose'; // For ES Modules
    // const mongoose = require('mongoose'); // For CommonJS

    // Ensure your DB_URI is loaded from environment variables (e.g., via config/env.js)
    import { DATABASE_URL } from '../config/env.js'; // Adjust path based on your structure

    const connectToDB = async () => {
      try {
        // Attempt to connect to MongoDB using the URI from your environment variables
        await mongoose.connect(DATABASE_URL);
        console.log(`✅ Successfully connected to MongoDB!`);
      } catch (error) {
        console.error(`❌ Error connecting to database: ${error.message}`);
        // Terminate the process if the database connection fails, as the app cannot function without it.
        process.exit(1);
      }
    };

    export default connectToDB; // Export the connection function
    ```

### 🔌 Integrating the Connection

You should call your `connectToDB` function when your application starts, typically before your Express server begins listening for requests.

* **In your main application file (e.g., `server.js` or `app.js`):**
    ```javascript
    // server.js (or app.js)
    import express from 'express';
    import { PORT } from './config/env.js'; // Ensure PORT is imported from your env config
    import connectToDB from './database/mongodb.js'; // Import your database connection function

    const app = express();
    app.use(express.json()); // Middleware to parse JSON request bodies

    // ... (other middleware and routes) ...

    // Start the server and then connect to the database
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      await connectToDB(); // Connect to the database
    });
    ```

---

## 6. 🛠️ Creating Models (Mongoose Schema)

Models are blueprints for your data. In Mongoose, you define a `Schema` which maps to a MongoDB collection and defines the shape of the documents within that collection, including their attributes, types, and validation rules.

### 📂 Folder Structure

* Create a `/models` folder in your project's root. This will contain your Mongoose model definitions.

### 📝 Defining a Schema

* **`models/Product.js`:**
    ```javascript
    // models/Product.js
    import { Schema, model } from "mongoose"; // Import Schema and model from mongoose

    // Define the schema for the Product model
    const productSchema = new Schema({
      // property_name: { type: DataType, required: [true, "Custom error message"], ...other_constraints }
      // Mongoose allows custom error messages for validation constraints.
      // Format: [ constraint_value, "message if constraint is not met" ]

      name: {
        type: String,
        required: [true, "Product name is required."], // 'name' is mandatory
        maxLength: [50, "Product name cannot exceed 50 characters."], // Max length of 50 characters
        trim: true // Automatically remove leading/trailing whitespace
      },
      price: {
        type: Number,
        required: [true, "Product price is required."],
        min: [0, "Price cannot be negative."] // Price must be 0 or greater
      },
      description: {
        type: String,
        maxLength: [500, "Description cannot exceed 500 characters."]
      },
      category: {
        type: String,
        enum: ["Electronics", "Books", "Clothing", "Home"], // Value must be one of these
        required: [true, "Product category is required."]
      },
      createdAt: {
        type: Date,
        default: Date.now // Automatically set creation date
      }
    });

    // Create the Mongoose Model from the schema
    // The first argument "Product" is the singular name of the collection.
    // Mongoose will automatically pluralize it to "products" in MongoDB.
    const Product = model("Product", productSchema);

    // Models should generally be capitalized (e.g., 'Product', 'User').
    // Export the model for use in your routes/controllers.
    export default Product;
    ```

---

## 7. 🚨 Creating a Global Error Handler & Middleware

Middleware functions in Express are functions that have access to the request object (`req`), the response object (`res`), and the `next` function in the application's request-response cycle. They can execute code, make changes to the request and response objects, end the request-response cycle, or call the next middleware function in the stack.

### 🧩 Understanding Middleware

A common use case for middleware is to perform checks or operations before a request reaches its final route handler.

* **Example: Authentication Middleware**
    This middleware checks if a user is authenticated before allowing access to a protected route.

    ```javascript
    // In a middleware file, e.g., middleware/authMiddleware.js
    import jwt from 'jsonwebtoken'; // You'll need to install jsonwebtoken: npm install jsonwebtoken

    // This function will be placed before a route handler
    const authenticateUser = (req, res, next) => {
      // Assuming token is sent in cookies or Authorization header
      const { authToken } = req.cookies; // You might need 'cookie-parser' middleware for this: npm install cookie-parser

      if (!authToken) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
      }

      try {
        // Verify the token using your secret key from environment variables
        // Make sure process.env.JWT_SECRET is defined in your .env files
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        // This makes user data available to subsequent middleware/route handlers
        req.user = decoded;

        next(); // Proceed to the next middleware or route handler
      } catch (error) {
        // Handle cases where the token is invalid or expired
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
      }
    };

    export default authenticateUser;
    ```

* **Using Middleware in Routes:**
    ```javascript
    // routes/someProtectedRoutes.js
    import { Router } from "express";
    import authenticateUser from '../middleware/authMiddleware.js'; // Import the middleware

    const protectedRouter = Router();

    // This route will only be accessible if authenticateUser passes
    protectedRouter.post("/create-resource", authenticateUser, (req, res) => {
      // If we reach here, req.user will contain the decoded token payload
      res.status(201).json({ message: `Resource created by user: ${req.user.id}` });
    });

    export default protectedRouter;
    ```

### 🌐 Global Error Handling Middleware

A global error handler is a special type of middleware that catches errors thrown by other middleware or route handlers. It's defined with four arguments: `(err, req, res, next)`. Express recognizes this signature as an error-handling middleware.

* **Create an Error Handler File (e.g., `middleware/errorHandler.js`):**
    ```javascript
    // middleware/errorHandler.js

    const errorHandler = (err, req, res, next) => {
      console.error(err.stack); // Log the error stack for debugging

      const statusCode = err.statusCode || 500; // Use custom status code if available, else 500
      const message = err.message || "Something went wrong on the server.";

      res.status(statusCode).json({
        success: false,
        message: message,
        // In development, you might send the error stack; in production, avoid it for security
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
      });
    };

    export default errorHandler;
    ```

* **Integrate into your `app.js` (or `server.js`):**
    The global error handler should be the **last** middleware loaded in your Express application, after all other routes and middleware.

    ```javascript
    // server.js (or app.js)
    import express from 'express';
    import { PORT } from './config/env.js';
    import connectToDB from './database/mongodb.js';
    import authRouter from './routes/authRoutes.js';
    import protectedRouter from './routes/someProtectedRoutes.js'; // Example protected routes
    import errorHandler from './middleware/errorHandler.js'; // Import the error handler
    import cookieParser from 'cookie-parser'; // For req.cookies in auth middleware

    const app = express();

    // --- Standard Middleware ---
    app.use(express.json()); // Parses JSON request bodies
    app.use(cookieParser()); // Parses cookies for req.cookies

    // --- Routes ---
    app.use("/api/auth", authRouter);
    app.use("/api/protected", protectedRouter); // Example of using protected routes

    // --- Global Error Handler ---
    // This MUST be the last middleware added to your Express app
    app.use(errorHandler);

    // Start the server and connect to the database
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      await connectToDB();
    });
    ```
    Any `throw new Error()` or unhandled promise rejections in your routes or other middleware will be caught by this `errorHandler`.