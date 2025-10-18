# 🐳 Docker Deployment Guide - Instamart

## 🚀 Quick Start

### **Prerequisites**
- Docker Engine 24.x or higher
- Docker Compose v2.x or higher
- 8GB RAM minimum, 16GB recommended
- 10GB free disk space

### **1. Clone & Setup**
```bash
# Clone repository
git clone <your-repo-url>
cd instamart

# Copy environment configuration
cp env.example .env

# Edit environment variables (important!)
nano .env
```

### **2. Production Deployment**
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Access application
# Frontend: http://localhost
# Backend API: http://localhost:5000
```

### **3. Development Setup**
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# Access development servers
# Frontend: http://localhost:3000 (hot reload)
# Backend: http://localhost:5000 (nodemon)
```

---

## 🏗️ Architecture Overview

### **Services Included**
- **Frontend**: React app served by Nginx
- **Backend**: Node.js Express API server
- **PostgreSQL**: Primary database for users, orders
- **MongoDB**: Product catalog and reviews
- **Redis**: Session storage and caching
- **Elasticsearch**: Search functionality (optional)

### **Port Mapping**
| Service | Internal Port | External Port | Purpose |
|---------|---------------|---------------|---------|
| Frontend | 80 | 80 | Web application |
| Backend | 5000 | 5000 | API server |
| PostgreSQL | 5432 | 5432 | Database |
| MongoDB | 27017 | 27017 | Document store |
| Redis | 6379 | 6379 | Cache |
| Elasticsearch | 9200 | 9200 | Search (optional) |

---

## ⚙️ Configuration

### **Environment Variables**

#### **Required Variables**
```bash
# Database passwords
POSTGRES_PASSWORD=your_secure_password
MONGO_PASSWORD=your_secure_password
REDIS_PASSWORD=your_secure_password

# Application secrets
JWT_SECRET=your_super_secure_jwt_secret_here
SESSION_SECRET=your_session_secret_key
```

#### **Optional Variables**
```bash
# External services
STRIPE_SECRET_KEY=sk_live_your_stripe_key
SENDGRID_API_KEY=your_sendgrid_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret

# Domain configuration
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### **Volume Configuration**
Data is persisted in Docker volumes:
- `postgres_data`: Database files
- `mongo_data`: MongoDB files
- `redis_data`: Redis data
- `elasticsearch_data`: Search indices

---

## 🚢 Deployment Commands

### **Basic Operations**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend

# View logs
docker-compose logs -f [service_name]

# Execute commands in container
docker-compose exec backend bash
docker-compose exec frontend sh
```

### **Database Operations**
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U admin -d instamart

# Access MongoDB
docker-compose exec mongo mongosh

# Access Redis
docker-compose exec redis redis-cli
```

### **Development Operations**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Rebuild specific service
docker-compose build frontend
docker-compose up -d frontend

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

---

## 📊 Monitoring & Health Checks

### **Health Check Endpoints**
- **Frontend**: `http://localhost/health`
- **Backend**: `http://localhost:5000/health`

### **Service Status**
```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs backend

# Monitor resource usage
docker stats
```

### **Database Health**
```bash
# PostgreSQL connection test
docker-compose exec postgres pg_isready -U admin

# MongoDB connection test
docker-compose exec mongo mongosh --eval "db.runCommand('ping')"

# Redis connection test
docker-compose exec redis redis-cli ping
```

---

## 🔧 Troubleshooting

### **Common Issues**

#### **1. Port Conflicts**
```bash
# Check what's using port 80
sudo lsof -i :80

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

#### **2. Permission Errors**
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Reset file permissions
sudo chown -R $USER:$USER .
```

#### **3. Memory Issues**
```bash
# Check Docker memory usage
docker system df

# Clean up unused images
docker system prune -a

# Increase Docker memory limit (Docker Desktop)
# Settings > Resources > Memory > 8GB+
```

#### **4. Database Connection Issues**
```bash
# Reset database volumes
docker-compose down -v
docker-compose up -d

# Check database logs
docker-compose logs postgres
docker-compose logs mongo
```

### **Reset Everything**
```bash
# Complete reset (destroys all data!)
docker-compose down -v
docker system prune -a
docker-compose up -d
```

---

## 🏭 Production Optimization

### **Performance Tuning**
```bash
# Increase container resources in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

### **Security Hardening**
```bash
# Use secrets instead of environment variables
services:
  backend:
    secrets:
      - jwt_secret
      - db_password

secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### **SSL/HTTPS Setup**
```bash
# Add SSL certificates
volumes:
  - ./ssl/cert.pem:/etc/ssl/certs/cert.pem:ro
  - ./ssl/private.key:/etc/ssl/private/private.key:ro
```

---

## 📈 Scaling

### **Horizontal Scaling**
```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Add load balancer
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - backend
```

### **Resource Monitoring**
```bash
# Monitor container resources
docker stats

# Check disk usage
docker system df

# Monitor logs
docker-compose logs -f --tail=100
```

---

## 🧪 Testing

### **Integration Testing**
```bash
# Run tests in containers
docker-compose exec backend npm test
docker-compose exec frontend npm test

# E2E testing
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### **Load Testing**
```bash
# Install testing tools
npm install -g artillery

# Run load tests
artillery run load-test.yml
```

---

## 📚 Useful Commands Reference

### **Docker Compose Commands**
```bash
docker-compose up -d                    # Start in background
docker-compose down                     # Stop and remove
docker-compose restart [service]        # Restart service
docker-compose logs -f [service]        # Follow logs
docker-compose exec [service] bash      # Execute commands
docker-compose ps                       # List services
docker-compose images                   # List images
docker-compose top                      # Show processes
```

### **Docker Commands**
```bash
docker ps                              # List containers
docker images                          # List images
docker system prune                    # Clean up
docker volume ls                       # List volumes
docker network ls                      # List networks
docker stats                           # Resource usage
```

---

## 📞 Support

### **Debugging**
1. Check service logs: `docker-compose logs [service]`
2. Verify environment variables: `docker-compose config`
3. Test database connections
4. Check network connectivity between containers

### **Getting Help**
- Check application logs for error messages
- Verify all environment variables are set
- Ensure Docker daemon is running
- Check available disk space and memory

---

**🚀 Your Instamart application should now be running successfully!**

**Access your application at:**
- **Production**: http://localhost
- **Development**: http://localhost:3000

**Happy coding! 🎉**
