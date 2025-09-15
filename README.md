# Plants App API 🌱

REST API built with NestJS for managing plant collections, gardens, and user subscriptions. This API provides a robust backend for plant enthusiasts to organize their gardens and track their plant collections.

## 🚀 Features

- **User Management & Authentication**
  - JWT-based authentication with access and refresh tokens
  - User registration and login
  - Role-based access control (Admin/User)
  - Subscription management (Free/Premium)

- **Garden Management**
  - Create and manage multiple gardens per user
  - Indoor and outdoor garden locations
  - Garden-specific plant collections
  - CRUD operations for gardens

- **Plant Management**
  - Add plants to specific gardens
  - Track plant species and nicknames
  - Plant lifecycle management

- **Security & Validation**
  - Password hashing with Argon2
  - Request validation using class-validator
  - Protected routes with JWT guards
  - Cookie-based token management

## 🛠️ Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport JWT
- **Password Hashing**: Argon2
- **Validation**: Class Validator & Class Transformer
- **Documentation**: Built-in Swagger support
- **Containerization**: Docker & Docker Compose

## 📦 Installation

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL database
- Docker (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Heitorop/Plants-App-Api.git
   cd Plants-App-Api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_db_username
   DATABASE_PASSWORD=your_db_password
   DATABASE_NAME=plants_app_db
   
   # Application Configuration
   APP_PORT=3000
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   ```

4. **Database Setup**
   
   Ensure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE plants_app_db;
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. **Create environment file**
   ```bash
   # Create .env file with the configuration above
   ```

2. **Start the application with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database container
   - Node.js application container

3. **Access the application**
   ```
   http://localhost:3000
   ```

### Manual Docker Build

```bash
# Build the image
docker build -t plants-api .

# Run the container
docker run -p 3000:3000 plants-api
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sign-in` | User registration |
| POST | `/auth/log-in` | User login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/log-out` | User logout |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes |
| POST | `/users/gardens` | Create a new garden | Yes |
| GET | `/users/gardens` | Get user's gardens | Yes |
| PATCH | `/users/gardens/:id` | Update a garden | Yes |
| DELETE | `/users/gardens/:id` | Delete a garden | Yes |

### Plant Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/plants` | Get plants | Yes |
| POST | `/plants` | Create a new plant | Yes |
| PATCH | `/plants/:id` | Update a plant | Yes |

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String, 2-20 characters)
- `email` (String, Unique)
- `password` (String, Hashed with Argon2)
- `role` (Enum: admin, user)
- `subscription_status` (Enum: free, premium)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Gardens Table
- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `location` (Enum: indoor, outdoor)
- `user_id` (UUID, Foreign Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Plants Table
- `id` (UUID, Primary Key)
- `species` (String, Optional)
- `nickname` (String)
- `garden_id` (UUID, Foreign Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Relationships
- Users have many Gardens (One-to-Many)
- Gardens have many Plants (One-to-Many)
- Gardens belong to Users (Many-to-One)
- Plants belong to Gardens (Many-to-One)

<p align="center">
  <strong>Database Structure</strong>
</p>
<img width="1085" height="618" alt="Database Schema" src="https://github.com/user-attachments/assets/92b92177-8c72-473a-89ba-511d888928bc" />

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start development server with hot reload
npm run start:debug        # Start development server with debugging

# Building
npm run build              # Build the application
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── decorators/        # Custom decorators
│   ├── dto/               # Data transfer objects
│   ├── guards/            # Route guards
│   ├── interfaces/        # TypeScript interfaces
│   └── strategies/        # Passport strategies
├── common/                # Shared utilities
│   └── enums/             # Application enums
├── config/                # Configuration files
├── garden/                # Garden management module
├── plant/                 # Plant management module
├── user/                  # User management module
└── utils/                 # Utility functions
```

## 🔒 Security Features

- **Password Security**: Passwords are hashed using Argon2
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator
- **Role-Based Access**: Different access levels for admin and regular users
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Built-in rate limiting capabilities

## 🌍 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_HOST` | PostgreSQL host | Yes | - |
| `DATABASE_PORT` | PostgreSQL port | Yes | 5432 |
| `DATABASE_USERNAME` | PostgreSQL username | Yes | - |
| `DATABASE_PASSWORD` | PostgreSQL password | Yes | - |
| `DATABASE_NAME` | PostgreSQL database name | Yes | - |
| `APP_PORT` | Application port | No | 3000 |
| `JWT_SECRET` | JWT secret key | Yes | - |
| `JWT_REFRESH_SECRET` | JWT refresh secret key | Yes | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ using NestJS
