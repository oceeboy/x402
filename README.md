# Phase 1 - X402 Lightning Express Server

A production-ready Express.js server that simulates an off-chain Lightning-like crypto payment middleware called X402. This system protects API routes by requiring payment (like HTTP 402 Payment Required) and lets clients simulate off-chain payments and top-ups.

## Features

- 🔒 **Payment Protection**: Routes protected with X402 payment middleware
- ⚡ **Lightning-like Payments**: Simulated off-chain payment system
- 📊 **Mock E-commerce Data**: Returns realistic e-commerce user data
- 🏗️ **Modular Architecture**: NestJS-inspired structure with Express
- 📝 **Production Logging**: Winston logger with file rotation
- 🔧 **TypeScript**: Fully typed with strict TypeScript configuration
- 🛡️ **Security**: Helmet, CORS, and other security middlewares

## Architecture

```
src/
├── config/          # Configuration management
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (X402 payment logic)
├── models/          # TypeScript interfaces and types
├── routes/          # Route definitions
├── services/        # Business logic (X402 payment service)
├── utils/           # Utilities (logger, etc.)
├── app.ts           # Express application setup
└── index.ts         # Server entry point
```

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Protected API Routes (Require Payment)

All protected routes require the `x-client-id` header and sufficient balance.

- **GET /api/getUserData** - Returns mock e-commerce user data (Cost: 1 unit)
- **GET /api/products** - Returns product catalog (Cost: 1 unit)
- **GET /api/orders** - Returns order history (Cost: 2 units)

### X402 Payment Routes

- **POST /x402/create-invoice** - Create a payment invoice
- **POST /x402/pay-invoice** - Pay an existing invoice
- **POST /x402/topup** - Add balance to client channel
- **GET /x402/invoice/:id** - Get invoice status
- **GET /x402/balance** - Get client balance (requires x-client-id header)

### Admin/Debug Routes

- **GET /x402/admin/clients** - Get all clients
- **GET /x402/admin/invoices** - Get all invoices
- **GET /health** - Health check

## Usage Example

### 1. Try accessing protected route without balance

```bash
curl -H "x-client-id: alice123" http://localhost:3001/api/getUserData
```

**Response (402 Payment Required):**

```json
{
  "error": "Payment Required",
  "code": 402,
  "invoice": {
    "id": "uuid-invoice-id",
    "clientId": "alice123",
    "amount": 1,
    "status": "pending",
    "createdAt": "2024-11-03T..."
  },
  "message": "Insufficient balance. Please pay invoice uuid-invoice-id to access this resource."
}
```

### 2. Top up client balance

```bash
curl -X POST http://localhost:3001/x402/topup \
  -H "Content-Type: application/json" \
  -d '{"clientId": "alice123", "amount": 10}'
```

### 3. Pay the invoice

```bash
curl -X POST http://localhost:3001/x402/pay-invoice \
  -H "Content-Type: application/json" \
  -d '{"invoiceId": "uuid-invoice-id", "payerClientId": "alice123"}'
```

### 4. Retry protected route

```bash
curl -H "x-client-id: alice123" http://localhost:3001/api/getUserData
```

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "clientId": "alice123",
    "name": "Chika Fashion",
    "topCategory": "Dresses",
    "bestSeller": "Black Midi Dress",
    "totalOrders": 1247,
    "averageOrderValue": 89.5,
    "favoriteColors": ["Black", "Navy", "Burgundy"],
    "lastPurchase": "2024-10-28T10:30:00Z",
    "membershipLevel": "Gold",
    "recommendations": [
      "Elegant Evening Gown",
      "Casual Summer Dress",
      "Professional Blazer"
    ]
  },
  "message": "User data retrieved successfully"
}
```

## Configuration

Environment variables can be set in `.env` file:

```bash
NODE_ENV=development
PORT=3001
HOST=localhost
API_PREFIX=/api
X402_PREFIX=/x402
DEFAULT_UNIT_COST=1
LOG_LEVEL=info
LOG_FILE=logs/app.log
ENABLE_MOCK_DATA=true
```

## Core X402 Functions

The X402 service provides these core functions:

- `ensureChannel(clientId)` - Create/get client channel
- `topUpChannel(clientId, amount)` - Add balance to channel
- `createInvoice(clientId, amount)` - Create payment invoice
- `payInvoice(invoiceId, payerClientId)` - Process invoice payment
- `getInvoice(id)` - Retrieve invoice details
- `clientHasCredit(clientId, amount)` - Check sufficient balance

## Payment Flow

1. **Client Request**: Client calls protected route with `x-client-id` header
2. **Balance Check**: Middleware checks if client has sufficient balance
3. **Payment Required**: If insufficient, creates invoice and returns 402 status
4. **Top Up**: Client can add balance via `/x402/topup`
5. **Pay Invoice**: Client pays invoice via `/x402/pay-invoice`
6. **Access Granted**: Retry original request - now succeeds with data

## Development

```bash
# Development with auto-reload
npm run dev

# Linting
npm run lint
npm run lint:fix

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

## Future Enhancements

This server is designed as Phase 1 for building an X402 project with plans to upgrade to a full MCP (Model Context Protocol) server in later phases.

## License

MIT License
