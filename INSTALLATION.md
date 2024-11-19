## 🚀 Installation Guide

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis 7+
- Stripe account
- AWS account (optional, for S3)
- Google OAuth credentials (optional)

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Configure environment variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fitness-app
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=your-stripe-secret-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-s3-bucket
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Installation Steps

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
npm run migrate
```

3. Start the development server:
```bash
npm run dev
```

### Authentication Setup

1. JWT Configuration:
   - Set a strong `JWT_SECRET` in `.env`
   - Default token expiry is 24h
   - Tokens are stored in Redis for blacklisting

2. Google OAuth (optional):
   - Create project in Google Console
   - Configure OAuth consent screen
   - Add authorized redirect URIs
   - Set Google credentials in `.env`

3. Two-Factor Authentication:
   - Uses TOTP (Time-based One-Time Password)
   - Compatible with Google Authenticator
   - Secret keys stored encrypted

### Payment Integration

1. Stripe Setup:
   - Create Stripe account
   - Add products and price IDs
   - Configure webhook endpoints
   - Set `STRIPE_SECRET_KEY` in `.env`

2. Configure subscription plans in `src/config/subscriptionPlans.js`:
```javascript
{
  BASIC: {
    id: 'price_basic',
    price: 5,
    // ...
  }
}
```

### AWS Integration (Optional)

1. S3 Setup:
   - Create S3 bucket
   - Configure CORS
   - Set bucket policies
   - Add AWS credentials to `.env`

2. Configure upload limits in `src/config/upload.js`

### Redis Configuration

1. Cache Setup:
   - Install Redis
   - Set `REDIS_URL` in `.env`
   - Configure cache TTL in `src/config/cache.js`

2. Queue Configuration:
   - Configure job attempts and backoff
   - Set up dead letter queues
   - Configure job priorities

### Monitoring Setup

1. APM Configuration:
   - Set up Elastic APM server
   - Configure APM in `.env`
   - Set service name and environment

2. Logging Setup:
   - Configure log levels
   - Set up log rotation
   - Configure external log shipping

### API Documentation

1. Swagger Setup:
```bash
npm run docs
```

2. Access API docs at `/api-docs`

### Testing

1. Run tests:
```bash
npm test
```

2. Run with coverage:
```bash
npm run test:coverage
```