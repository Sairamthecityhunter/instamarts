# 🚀 Instamart Setup Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 16+ and npm
- Docker and Docker Compose (optional, for full stack)
- PostgreSQL, MongoDB, Redis (or use Docker)

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install-all

# Or install individually
npm install                    # Root dependencies
cd server && npm install      # Backend dependencies
cd ../client && npm install   # Frontend dependencies
```

### 2. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run client    # Frontend only (port 3000)
npm run server    # Backend only (port 5000)
```

### 3. Environment Setup
```bash
# Copy environment templates
cp server/.env.example server/.env
cp client/.env.example client/.env

# Update with your configuration
```

## 🐳 Docker Development

### Full Stack with Dependencies
```bash
# Start complete development environment
docker-compose up -d

# Services included:
# - React Frontend (port 3000)
# - Node.js Backend (port 5000)
# - PostgreSQL (port 5432)
# - MongoDB (port 27017)
# - Redis (port 6379)
# - Elasticsearch (port 9200)
```

### Individual Services
```bash
# Database only
docker-compose up postgres mongo redis -d

# Backend only
docker-compose up server -d

# Frontend only
docker-compose up client -d
```

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **Product API**: http://localhost:5000/api/products

## 🛠️ Development Commands

```bash
# Build for production
npm run build

# Run tests
cd client && npm test
cd server && npm test

# Lint and format
cd client && npm run lint
cd server && npm run lint
```

## 🗃️ Database Setup

### PostgreSQL (User data, orders, payments)
```sql
CREATE DATABASE instamart;
CREATE USER admin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE instamart TO admin;
```

### MongoDB (Product catalog, reviews)
```javascript
use instamart
db.createCollection('products')
db.createCollection('categories')
db.createCollection('reviews')
```

### Redis (Caching, sessions)
```bash
# No setup required - works out of the box
redis-cli ping  # Should return PONG
```

## 🚀 Deployment

### Production Build
```bash
# Build optimized frontend
cd client && npm run build

# Build backend
cd server && npm run build
```

### Environment Variables (Production)
```bash
# Server (.env)
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
MONGODB_URI=mongodb://host:27017/instamart
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-key

# Client (.env)
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000 or 5000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **TypeScript errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Database connection issues**
   ```bash
   # Check if services are running
   docker-compose ps
   
   # Restart specific service
   docker-compose restart postgres
   ```

### Performance Optimization

1. **Enable production optimizations**
   - Gzip compression (enabled)
   - Image optimization
   - Bundle splitting
   - Caching headers

2. **Database indexing**
   ```sql
   -- PostgreSQL indexes
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_orders_user_id ON orders(user_id);
   ```

3. **Redis caching**
   - Product data caching
   - User session management
   - Search result caching

## 📊 Monitoring & Analytics

### Health Checks
- Backend: `GET /health`
- Database connectivity
- Redis connectivity
- External service status

### Metrics Collection
- User engagement
- Order conversion rates
- API response times
- Error rates

## 🔐 Security

### Authentication
- JWT tokens with refresh mechanism
- Password hashing with bcrypt
- Rate limiting enabled

### API Security
- CORS configured
- Input validation with Joi
- SQL injection prevention
- XSS protection

## 📞 Support

For technical issues or questions:
1. Check this documentation
2. Review error logs
3. Open an issue on the project repository

---

**Note**: This is a development setup. For production deployment, ensure proper security configurations, monitoring, and backup procedures. 