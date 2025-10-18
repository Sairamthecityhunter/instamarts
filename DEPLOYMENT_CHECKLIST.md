# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### **🔧 Environment Setup**
- [ ] Docker & Docker Compose installed (v24.x+ & v2.x+)
- [ ] Minimum 8GB RAM, 16GB recommended
- [ ] Minimum 10GB free disk space
- [ ] Server/VPS with public IP address
- [ ] Domain name configured (optional)

### **🔐 Security Configuration**
- [ ] Copy `env.example` to `.env`
- [ ] Generate secure JWT secret (32+ characters)
- [ ] Set strong database passwords
- [ ] Configure Redis password
- [ ] Update default admin credentials
- [ ] Enable firewall (ports 80, 443, 22 only)

### **🌐 Domain & SSL (Production)**
- [ ] Domain DNS configured
- [ ] SSL certificates obtained (Let's Encrypt recommended)
- [ ] HTTPS redirect configured
- [ ] CDN setup (optional but recommended)

### **📊 Monitoring Setup**
- [ ] Log aggregation configured
- [ ] Health check endpoints tested
- [ ] Backup strategy planned
- [ ] Monitoring alerts configured

---

## 🚀 Deployment Steps

### **1. Initial Setup**
```bash
# Clone repository
git clone <your-repository>
cd instamart

# Configure environment
cp env.example .env
nano .env  # Edit with your values
```

### **2. Security Hardening**
```bash
# Generate secure secrets
openssl rand -base64 32  # JWT secret
openssl rand -base64 32  # Session secret
openssl rand -base64 16  # Database passwords
```

### **3. Deploy Application**
```bash
# Start production environment
docker-compose up -d

# Verify all services running
docker-compose ps

# Check logs for errors
docker-compose logs
```

### **4. Post-Deployment Verification**
```bash
# Test frontend access
curl -I http://localhost

# Test backend API
curl http://localhost:5000/health

# Test database connections
docker-compose exec postgres pg_isready -U admin
docker-compose exec mongo mongosh --eval "db.runCommand('ping')"
docker-compose exec redis redis-cli ping
```

---

## 🔧 Configuration Templates

### **Production Environment Variables**
```bash
# Required - Update these values!
POSTGRES_PASSWORD=your_secure_postgres_password_here
MONGO_PASSWORD=your_secure_mongo_password_here  
REDIS_PASSWORD=your_secure_redis_password_here
JWT_SECRET=your_super_secure_jwt_secret_32_chars_min
SESSION_SECRET=your_session_secret_key_here

# Optional - Add if using external services
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
SENDGRID_API_KEY=SG.your_sendgrid_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your-s3-bucket-name

# Domain configuration (update for your domain)
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### **Nginx SSL Configuration** (if using custom nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 Health Monitoring

### **Service Health Checks**
```bash
# Frontend health
curl http://localhost/health

# Backend health  
curl http://localhost:5000/health

# Database health
docker-compose exec postgres pg_isready
docker-compose exec mongo mongosh --eval "db.runCommand('ping')"
docker-compose exec redis redis-cli ping
```

### **Performance Monitoring**
```bash
# Container resource usage
docker stats

# Disk usage
docker system df

# Log monitoring
docker-compose logs -f --tail=100
```

---

## 🔄 Backup & Recovery

### **Database Backup**
```bash
# PostgreSQL backup
docker-compose exec postgres pg_dump -U admin instamart > backup.sql

# MongoDB backup
docker-compose exec mongo mongodump --db instamart --out /tmp/backup
docker-compose cp mongo:/tmp/backup ./mongo_backup

# Redis backup
docker-compose exec redis redis-cli BGSAVE
```

### **Volume Backup**
```bash
# Backup all volumes
docker run --rm -v instamart_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
docker run --rm -v instamart_mongo_data:/data -v $(pwd):/backup alpine tar czf /backup/mongo_backup.tar.gz -C /data .
docker run --rm -v instamart_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis_backup.tar.gz -C /data .
```

---

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **Port 80 Already in Use**
```bash
# Find what's using port 80
sudo lsof -i :80

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

#### **Permission Denied Errors**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER .
```

#### **Database Connection Errors**
```bash
# Check if databases are running
docker-compose ps

# Reset database volumes (destroys data!)
docker-compose down -v
docker-compose up -d

# Check database logs
docker-compose logs postgres
docker-compose logs mongo
```

#### **Memory/Disk Issues**
```bash
# Clean up Docker
docker system prune -a

# Check disk space
df -h

# Check memory usage
free -h
```

---

## 📈 Scaling & Performance

### **Horizontal Scaling**
```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Add load balancer
# Update docker-compose.yml with nginx load balancer
```

### **Performance Optimization**
```bash
# Monitor performance
docker stats

# Optimize images
docker-compose build --no-cache

# Enable compression in nginx
# Add gzip configuration to nginx.conf
```

---

## 🔒 Security Best Practices

### **Container Security**
- [ ] Run containers as non-root users
- [ ] Use official base images only
- [ ] Keep images updated
- [ ] Scan for vulnerabilities
- [ ] Use secrets management

### **Network Security**
- [ ] Enable firewall (ufw or iptables)
- [ ] Use private Docker networks
- [ ] Encrypt database connections
- [ ] Enable rate limiting
- [ ] Use HTTPS only

### **Data Security**
- [ ] Encrypt sensitive environment variables
- [ ] Regular database backups
- [ ] Secure backup storage
- [ ] Access logging enabled
- [ ] Regular security updates

---

## 📞 Support & Maintenance

### **Regular Maintenance Tasks**

#### **Daily**
- [ ] Check service status
- [ ] Monitor logs for errors
- [ ] Verify backup completion

#### **Weekly**
- [ ] Update Docker images
- [ ] Review security logs
- [ ] Test backup restoration

#### **Monthly**
- [ ] Security updates
- [ ] Performance review
- [ ] Capacity planning

### **Emergency Procedures**

#### **Service Down**
```bash
# Quick restart
docker-compose restart

# Check logs
docker-compose logs -f

# Full rebuild if needed
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### **Data Recovery**
```bash
# Restore from backup
docker-compose down
# Restore volume backups
docker-compose up -d
```

---

## ✅ Final Verification

### **Deployment Success Checklist**
- [ ] Frontend loads at http://localhost (or your domain)
- [ ] Backend API responds at http://localhost:5000/health
- [ ] All Docker containers running (`docker-compose ps`)
- [ ] Databases accepting connections
- [ ] No error logs in `docker-compose logs`
- [ ] SSL certificate valid (if configured)
- [ ] Monitoring alerts configured
- [ ] Backup system tested

---

**🎉 Congratulations! Your Instamart application is now deployed and running in production!**

**📞 For support or issues, check the logs first:**
```bash
docker-compose logs -f
```

**🔄 For updates:**
```bash
git pull
docker-compose build --no-cache
docker-compose up -d
```
