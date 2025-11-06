# Project Structure

```
invoicepay/
├── .env                    # Environment configuration
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
├── package.json           # NPM dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── test-x402.js           # Test script for X402 flow if you modify create a test for it i got my own test i could share mine if lost
├── logs/                  # Log files (auto-created)
├── dist/                  # Compiled JavaScript (auto-created)
├── node_modules/          # Dependencies (auto-created)
└── src/
    ├── index.ts           # Application entry point
    ├── app.ts             # Express app configuration
    ├── config/
    │   └── index.ts       # Configuration management
    ├── controllers/
    │   ├── api.controller.ts    # Protected API endpoints
    │   └── x402.controller.ts   # X402 payment endpoints
    |   └── user.controller.ts  # user controller example
    ├── middleware/
    │   └── x402.middleware.ts   # Payment middleware & validation
    ├── models/
    │   └── index.ts       # TypeScript interfaces & types
    ├── routes/
    │   ├── index.ts       # Main router
    │   ├── api.routes.ts  # API route definitions
    │   └── x402.routes.ts # X402 route definitions
    ├── services/
    │   └── x402.service.ts      # Core payment business logic
    └── utils/
        └── logger.ts      # Winston logger configuration
```

## Key Files Explained

### Core Application

- **`src/index.ts`** - Server startup, graceful shutdown, error handling
- **`src/app.ts`** - Express application setup, middleware configuration
- **`src/config/index.ts`** - Environment variables and configuration

### X402 Payment System

- **`src/services/x402.service.ts`** - Core payment logic (channels, invoices, balance)
- **`src/middleware/x402.middleware.ts`** - Payment protection middleware
- **`src/controllers/x402.controller.ts`** - Payment API endpoints

### Protected APIs

- **`src/controllers/user.controller.ts` ** - Is more like a play test for something not serious but still worth testing
- **`src/controllers/api.controller.ts`** - Mock e-commerce endpoints
- **`src/routes/api.routes.ts`** - Protected route definitions

### Infrastructure

- **`src/utils/logger.ts`** - Production logging with Winston
- **`src/models/index.ts`** - TypeScript type definitions
- **`test-x402.js`** - End-to-end test script very needed

## Available Scripts

```bash
npm run dev      # Start development server with hot-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
npm run clean    # Clean build artifacts
```
