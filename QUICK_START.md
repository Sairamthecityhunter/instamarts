# 🚀 Quick Start Guide

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 15+ (or use Docker)
- Docker and Docker Compose (optional, for full stack)

## Quick Start (Local Development)

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Set Up Environment Variables

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your database credentials

# Client
cp client/.env.example client/.env
# Edit client/.env if needed (defaults work for local dev)
```

### 3. Set Up Database

```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d postgres-dev

# Or use your local PostgreSQL
# Make sure DATABASE_URL in server/.env points to your database

# Generate Prisma Client
cd server
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Servers

```bash
# From root directory - start both frontend and backend
npm run dev

# Or start individually:
npm run server    # Backend only (port 5000)
npm run client    # Frontend only (port 3000)
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **Prisma Studio** (Database GUI): `cd server && npm run db:studio`

## Database Commands

```bash
cd server

# Generate Prisma Client (after schema changes)
npm run db:generate

# Create and run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database (WARNING: deletes all data)
npm run db:reset

# Open Prisma Studio (Database GUI)
npm run db:studio
```

## Docker Quick Start

```bash
# Start all services (PostgreSQL, Redis, MongoDB, Backend, Frontend)
docker-compose -f docker-compose.dev.yml up -d

# Run migrations and seed
docker-compose -f docker-compose.dev.yml exec backend-dev npm run db:migrate
docker-compose -f docker-compose.dev.yml exec backend-dev npm run db:seed

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

## Testing the API

### Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (use access token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Products API

```bash
# Get all products
curl http://localhost:5000/api/products

# Search products
curl "http://localhost:5000/api/products?search=banana&page=1&limit=10"

# Get product by ID
curl http://localhost:5000/api/products/1

# Get categories
curl http://localhost:5000/api/products/categories/list

# Get featured products
curl http://localhost:5000/api/products/featured/list
```

## Default Test Credentials

After seeding the database:

- **Email**: john@example.com
- **Password**: password123

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database connection
cd server
npm run db:studio  # Should open Prisma Studio if connected
```

### Port Already in Use

```bash
# Kill process on port 3000 or 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Prisma Client Not Generated

```bash
cd server
npm run db:generate
```

### Reset Everything

```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down -v

# Reset database
cd server
npm run db:reset

# Restart services
cd ..
docker-compose -f docker-compose.dev.yml up -d
```

## Next Steps

1. ✅ Database setup with Prisma
2. ✅ Authentication with refresh tokens (httpOnly cookies)
3. ✅ Products API with search/sort/pagination
4. ✅ Axios client layer in frontend
5. 🔄 Migrate `/cart` and `/orders` to use database (next step)

## API Routes

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login (sets httpOnly refresh token cookie)
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user
- `PUT /me` - Update profile
- `POST /logout` - Logout (invalidates refresh token)
- `POST /logout-all` - Logout from all devices

### Products (`/api/products`)
- `GET /` - Get all products (with pagination, search, filters)
- `GET /:id` - Get product by ID or slug
- `GET /categories/list` - Get all categories
- `GET /featured/list` - Get featured products
- `GET /recommendations/:userId` - Get product recommendations
- `GET /search/suggestions` - Get search suggestions

### Cart (`/api/cart`) - *To be migrated*
### Orders (`/api/orders`) - *To be migrated*

