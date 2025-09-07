# Backend Technical Assessment: User Service API (Node.js)

This repository contains my submission for the **Backend Developer Technical Assessment**. The project is a **RESTful API** for managing user profiles, built with a modern **Node.js and Express.js** stack. It also includes a **pseudocode solution for dynamic delivery slot allocation**.

The project fulfills all core requirements of the assessment and implements several bonus objectives, including comprehensive API documentation (Swagger), a full suite of unit and integration tests (Jest), and complete containerization for deployment (Docker).

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
  - [API Documentation (Swagger UI)](#api-documentation-swagger-ui)
  - [Authentication Flow & Testing with Swagger](#authentication-flow--testing-with-swagger)
  - [Example Requests (cURL)](#example-requests-curl)
- [Testing](#testing)
- [Task 2: Delivery Slot Pseudocode](#task-2-delivery-slot-pseudocode)
- [Deployment](#deployment)
- [Challenges Faced](#challenges-faced)
- [Architecture & Flow Diagrams](#architecture--flow-diagrams)

---

## Features

- **CRUD Operations:** Full Create, Read, Update, and Delete functionality for user profiles.
- **Secure by Default:** All user management endpoints are secured using JWT-based authentication middleware.
- **Robust Validation:** Implements server-side validation for request data and ensures email uniqueness.
- **Modular Architecture:** Cleanly separated concerns into `routes`, `controllers`, `services`, and `middleware`.
- **Global Error Handling:** Gracefully handles common errors through a centralized error-handling middleware.
- **Performance Optimized:**
  - **Database Indexing:** Utilizes a unique index on the `email` field for near-instant lookups during login and creation. A performance index is also applied to the `age` field to accelerate filtering.
  - **Efficient Queries:** Leverages performant, index-aware Mongoose methods (`findById`, `findOne`, `findByIdAndUpdate`) and projections to minimize payload size.
- **Pagination & Filtering:** Supports pagination and efficient filtering by age (`?age=...`).
- **Interactive API Documentation:** Automatically generated and interactive API documentation is provided via Swagger UI.
- **Database Seeding:** Automatically creates a default `admin` user on first launch to facilitate API testing.
- **Comprehensive Testing:** Includes both unit tests (Jest) for business logic and integration tests (Supertest) for API endpoints.

---

## Project Structure

The application follows a standard modular architecture to ensure a clean separation of concerns:

```
/
├── config/ # Database connection logic, data initializer, Swagger config
├── controllers/ # Request handling and business logic
├── middleware/ # Custom middleware (authentication, error handling, validation)
├── models/ # Mongoose data models (e.g., user.model.js)
├── routes/ # API route definitions with Swagger annotations
├── services/ # Core business logic layer
├── utils/ # Utility classes (e.g., AppError)
└── tests/ # Unit and integration tests
```

---

## Technologies Used

- **Node.js** (Runtime Environment)
- **Express.js** (Web Framework)
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** (Object Data Modeling for MongoDB)
- **JSON Web Tokens (JWT)** (for token-based auth)
- **dotenv** (for managing environment variables)
- **Jest & Supertest** (for testing)
- **Swagger (`swagger-jsdoc`, `swagger-ui-express`)** (for documentation)
- **Docker** (for containerization)

---

## Setup and Installation

### Prerequisites

- Node.js v18+
- npm v9+ (or Yarn)
- A running MongoDB instance (local or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))

### Steps

1.  **Clone the Repository**

    ```bash
    git clone <your-repo-url>
    cd user-service-node
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a file named `.env` in the root of the project and paste the following content. This is a ready-to-use configuration for demonstration purposes.

    > **Note:** These credentials are for a sandboxed, assessment-only database. In a real-world project, secrets should never be committed to a repository.

    ```env
    # --- Paste this content into your .env file ---
    MONGO_URI=mongodb+srv://nadeemmohammed12346:bt5ejDPOluwYGjiE@project.ye2wcmq.mongodb.net/user_assessment_db
    JWT_SECRET=1VfGzUyotZgvj5jPEGCar8gWgpfEvbTai/tkvu3bk/Q=
    JWT_EXPIRES_IN=24h
    PORT=3000
    ```

4.  **Run the Application**
    ```bash
    npm start
    ```
    The application will start on the port defined in your `.env` file (e.g., **http://localhost:3000**).

---

## Usage

### API Documentation (Swagger UI)

Interactive API documentation is the primary way to explore and test this API. Once the application is running, visit:

**http://localhost:3000/api-docs**

### Authentication Flow & Testing with Swagger

All endpoints under the `Users` tag are protected. To test them, you must first get a JWT and authorize your session in Swagger.

**Step 1: Get the Admin Token**

- On the application's first start against an empty database, a default admin user is seeded with the email `admin@example.com`.
- In the Swagger UI, expand the `Auth` tag and the `POST /api/auth/login` endpoint.
- Click **"Try it out"**.
- In the request body, enter the admin's email:
  ```json
  {
    "email": "admin@example.com"
  }
  ```
- Click "Execute". You will receive a token in the response body. Copy this token.

**Step 2: Authorize Your Session**

- At the top right of the Swagger page, click the green "Authorize" button.
- In the dialog that appears, paste the token you copied into the "Value" field.
- Click "Authorize" and then "Close".

You are now authenticated! All subsequent requests you make from the Swagger UI will automatically include the necessary `Authorization: Bearer <token>` header, allowing you to test the protected Users endpoints.

### Example Requests (cURL)

If you prefer using the command line, here are some examples:

1. **Get a Token**

   ```bash
   curl -X POST http://localhost:3000/api/auth/login     -H "Content-Type: application/json"     -d '{
       "email": "admin@example.com"
   }'
   ```

2. **Create a New User (Requires Token)**
   ```bash
   curl -X POST http://localhost:3000/api/users     -H "Content-Type: application/json"     -H "Authorization: Bearer <YOUR_JWT_TOKEN>"     -d '{
       "name": "Jane Doe",
       "email": "jane.doe@example.com",
       "age": 28
   }'
   ```

---

## Testing

The project includes a comprehensive test suite using Jest and Supertest.

- **Unit Tests** (`/__tests__/unit`): Test the service layer business logic in isolation.
- **Integration Tests** (`/__tests__/integration`): Test the full API request-response cycle using an in-memory MongoDB server.

To run all tests:

```bash
npm test
```

---

## Task 2: Delivery Slot Pseudocode

The detailed pseudocode for dynamic delivery slot allocation is included in the root of this repository:  
`delivery_slots_pseudocode.md`.

The solution ensures:

- **No Overbooking:** Uses atomic database operations to handle concurrent requests safely.
- **Dynamic Assignment:** Allocates slots based on real-time availability.
- **Alternative Suggestions:** Provides fallback options when a preferred slot is full.

---

## Deployment

The application is fully containerized with Docker and ready for deployment.

- **Docker:** A Dockerfile is included to build a lightweight, production-ready image.

  ```bash
  # 1. Build the Docker image
  docker build -t user-service-node .

  # 2. Run the container, passing in environment variables
  docker run -p 3000:3000       -e MONGO_URI="<your_mongo_uri>"       -e JWT_SECRET="<your_jwt_secret>"       user-service-node
  ```

- **Heroku & Render:** The project can be easily deployed to platforms like Heroku (using the included Procfile) or Render (using the Dockerfile).

**Note on Live Deployment:** A live URL for this project is not available. While the application is fully containerized and configured for seamless deployment, modern free-tier services often require credit card verification, which was not feasible for this submission. The project is otherwise 100% deployment-ready.

---

## Challenges Faced

- **First User Creation Problem:** Securing all user-related endpoints, including user creation, introduced a logical dilemma. To address this, a DataInitializer script was implemented to automatically seed a default admin user into the database during the application's first startup. This seeded admin serves as the initial entry point for authentication, enabling the generation of the first JWT token and allowing secure access to subsequent endpoints.

---

## Architecture & Flow Diagrams

### High-Level Architecture

```mermaid
flowchart TD
    Client[Client / Swagger UI] -->|HTTP Requests| API[Node.js / Express API]
    API --> Routes[Routing Layer w/ Swagger Annotations]
    Routes --> Middleware[Auth & Validation Middleware]
    Middleware --> Controller[Controller Layer]
    Controller --> Service[Service Layer]
    Service --> Model[Mongoose Model]
    Model --> DB[(MongoDB Atlas)]
```

### Request Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API (Express)
    participant M as Auth Middleware
    participant S as AuthService
    participant DB as Database

    C->>A: POST /api/auth/login {email}
    A->>S: login(email)
    S->>DB: findOne({email})
    DB-->>S: User Document
    S-->>A: Generate & Return JWT
    A-->>C: { token: "..." }

    C->>A: GET /api/users with Bearer Token
    A->>M: Verify Token
    M->>DB: Find user from token ID
    DB-->>M: User Document
    M-->>A: User is authorized, attach user to request
    A-->>C: List of Users
```
