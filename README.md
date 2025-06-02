# 🚀 Backend Development Essentials

**Date: June 2, 2025**

---

This document summarizes essential concepts for backend development, primarily focusing on **Node.js, Express, and MongoDB**. While some details are specific to these technologies, many of the principles and practices discussed here are broadly applicable to various backend frameworks and databases.

---

## 1. Project Initialization & Linting

Getting your project set up and ensuring code quality from the start.

### 📦 Initialize Your Node.js Application

To begin your backend project, you'll first set up a `package.json` file, which manages your project's dependencies and scripts.

* Open your terminal in your project's root directory and type:
    ```bash
    npm init -y
    ```
    * The `-y` flag automatically accepts all the default settings, quickly generating your `package.json` file.

### 🛡️ Set Up ESLint for Code Quality

ESLint helps you find and fix problems in your JavaScript code, ensuring consistent style and preventing common errors.

* In your terminal, run:
    ```bash
    npm init @eslint/config@latest
    ```
    * This command will guide you through a series of questions to configure ESLint according to your project's needs.

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

    * **Example `config/env.js`:**
        ```javascript
        // config/env.js
        import dotenv from 'dotenv'; // Use 'require' if not using ES modules

        // Dynamically load the correct .env file based on the NODE_ENV
        // If NODE_ENV is not set, it defaults to 'development'.
        dotenv.config({
          path: `.env.${process.env.NODE_ENV || "development"}.local`
        });

        // Export the environment variables you need
        export const PORT = process.env.PORT;
        export const DATABASE_URL = process.env.DATABASE_URL;
        // Add any other variables you need here
        ```
    * **Usage in your main file (e.g., `server.js`):**
        ```javascript
        // server.js
        import { PORT } from './config/env.js'; // Adjust path as needed
        // const { PORT } = require('./config/env'); // For CommonJS

        // Your Express app setup
        // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        ```

### 📄 Create Environment Files

These files will store your actual key-value pairs for environment variables.

1.  **In your project's root folder**, create these two files:
    * `.env.production.local`
    * `.env.development.local`

    * **Example `.env.development.local`:**
        ```
        PORT=3000
        DATABASE_URL=mongodb://localhost:27017/mydevdb
        SECRET_KEY=mydevsecret
        ```
    * **Example `.env.production.local`:**
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
    * This ensures that any file starting with `.env.` and ending with `.local` will be ignored by Git.

---

## 3. 🛣️ Creating Routes

Routes define the endpoints of your API and how your application responds to different HTTP requests (GET, POST, PUT, DELETE, etc.).

### 📂 Organize Your Routes

1.  **Create a `/routes` folder** in your project's root directory. This helps keep your routing logic modular and organized.

### 📝 Router Structure

Each major resource or feature (e.g., authentication, users, products) should typically have its own router file.

* Follow this common structure for creating an Express router:

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

* **In your main application file (e.g., `server.js` or `app.js`):**
    ```javascript
    // server.js
    import express from 'express';
    import authRouter from './routes/authRoutes.js'; // Adjust path as needed
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
    * **Good:** `/users`, `/products`
    * **Bad:** `/getUsers`, `/createProduct` (HTTP methods handle actions)

2.  **Use Plural Nouns for Collections:**
    * **Collections** (lists of resources) should use plural nouns.
    * **Example:** `/users` (represents the collection of all users), `/products` (represents the collection of all products).

3.  **Use Singular Nouns (with ID) for Specific Documents:**
    * To refer to a single instance of a resource (a "document"), use a singular noun followed by its unique identifier (ID).
    * **Example:** `/users/{id}`, `/books/{id}` (e.g., `/users/123`, `/books/isbn-978-0321765723`)

4.  **Nest Sub-Resources Under Their Parent Document:**
    * If a resource is a component or collection of another, nest it.
    * **Example:**
        * `/products/{id}/comments` (all comments for a specific product)
        * `/users/{id}/cart-items` (all items in a specific user's cart)

5.  **Use Hyphens for Multi-Word Resource Names:**
    * For readability, separate words in resource names with hyphens.
    * **Example:** `/user-profiles`, `/blog-posts`
    * **Avoid:** `/userProfiles`, `/blogposts`

6.  **Avoid Deep Nesting (Limit to 2 or 3 Levels):**
    * While nesting is useful, too many levels can make URLs long and hard to manage. Aim for a maximum of 2 or 3 levels.
    * **Generally Acceptable:** `/products/{id}/comments/{commentId}` (3 levels, to get a specific comment for a specific product)
    * **Consider Alternatives for Deeper Nesting:** If you find yourself going deeper, consider if the relationship can be flattened or if a different resource structure would be more appropriate.

7.  **Be Consistent:**
    * The most important rule! Once you choose a convention, stick to it across your entire API. Consistency makes your API predictable and easy to learn.


connecting to database:
1. create /database folder
2. create mongodb.js file, then in the following setup the code

const connectToDB = async() => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`successfully connected to database`);
    } catch(error) {
        console.log(`Error details: ${error.message}`);
        process.exit(1); // terminate the process if failed
    }
}

3. then import it to use
in app.js

app.listen(PORT, async() => { 
    await connectToDB();
 })