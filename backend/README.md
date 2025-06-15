# Flash USDT Backend API

Production-ready backend API for Flash USDT Liquidity Bot with comprehensive features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup database:**
```bash
# Create database
createdb flashusdt_db

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

4. **Start development server:**
```bash
npm run dev
```

## 📋 Environment Configuration

### Required Variables
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/flashusdt_db
JWT_SECRET=your-super-secret-jwt-key
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@flashusdt.com
```

### Optional Variables (for blockchain integration)
```env
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x... # Will be set after contract deployment
```

## 🏗️ Architecture

### Database Schema
- **Users**: User accounts and KYC information
- **Investments**: Investment tracking and profits
- **KYC Submissions**: Manual KYC review system
- **Contact Messages**: Customer support system
- **Audit Logs**: Complete audit trail
- **System Settings**: Configurable parameters

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### KYC Management
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status` - Check KYC status
- `POST /api/admin/kyc/:userId/approve` - Admin KYC approval

#### Bot Operations
- `GET /api/bot/stats` - Get bot statistics
- `POST /api/investments` - Record new investment
- `GET /api/investments/user` - Get user investments

#### Support
- `POST /api/contact` - Submit support request
- `GET /api/health` - Health check endpoint

## 🔧 Development

### Running Tests
```bash
npm test
npm run test:watch
npm run test:coverage
```

### Database Operations
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

### Code Quality
```bash
# Lint code
npm run lint
npm run lint:fix
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

### Production Setup
1. Set `NODE_ENV=production`
2. Configure SSL certificates
3. Setup reverse proxy (Nginx)
4. Configure monitoring
5. Setup backup strategy

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

Response includes:
- Server status
- Database connectivity
- Blockchain connection status
- System uptime

### Logging
- Application logs: `./logs/app.log`
- Error logs: `./logs/error.log`
- Access logs: Combined format

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (user/admin)
- Password hashing with bcrypt
- Rate limiting on API endpoints

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Helmet.js
- CORS configuration

### KYC Compliance
- Manual KYC review process
- Document upload and verification
- Audit trail for all KYC decisions
- GDPR compliance features

## 📧 Email System

### Automated Emails
- Welcome emails
- KYC status notifications
- Investment confirmations
- Emergency alerts
- Support ticket responses

### Email Templates
All emails use responsive HTML templates with:
- Company branding
- Multi-language support (TR/EN)
- Unsubscribe links
- Legal compliance

## 🔗 Blockchain Integration

### Smart Contract Integration
- Automatic event listening
- Transaction verification
- Real-time profit distribution
- Emergency mode detection

### Supported Networks
- Ethereum Mainnet
- Sepolia Testnet
- Polygon (planned)
- BSC (planned)

## 📈 Performance

### Optimization Features
- Database connection pooling
- Redis caching (optional)
- Response compression
- Request rate limiting
- Query optimization

### Scalability
- Horizontal scaling ready
- Load balancer compatible
- Microservice architecture
- Database sharding support

## 🛠️ Maintenance

### Database Maintenance
```bash
# Backup database
pg_dump flashusdt_db > backup.sql

# Restore database
psql flashusdt_db < backup.sql

# Analyze performance
npm run db:analyze
```

### Log Rotation
- Automatic log rotation
- Configurable retention period
- Compressed archive storage

## 🚨 Emergency Procedures

### Emergency Mode
When emergency mode is activated:
1. All new investments are blocked
2. Emergency withdrawal is enabled
3. Admin notifications are sent
4. Audit logs are created

### Incident Response
1. Check health endpoint
2. Review error logs
3. Verify database connectivity
4. Check blockchain connection
5. Notify stakeholders

## 📚 API Documentation

### Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <token>
```

### Error Responses
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Success Responses
```json
{
  "message": "Success message",
  "data": {},
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Write tests
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- Email: support@flashusdt.com
- Documentation: https://docs.flashusdt.com
- Issues: GitHub Issues