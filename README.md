<div align="center">

# ⚽ Analytics Soccer — Backend API

### A modular football analytics and subscription platform backend

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

**REST API · Authentication · Football Statistics · Payments · Media Management**

</div>

---

## 📖 Overview

**Analytics Soccer Backend** is a TypeScript-powered REST API for a football analytics platform. It provides modular endpoints for football statistics and player/team data alongside account management, subscriptions, payments, and supporting platform services.

The codebase uses **Express 5**, **MongoDB with Mongoose**, and a feature-oriented **route → controller → service → model** structure.

> **Project scope:** This documentation describes modules and integrations visible in the repository. It does not imply that every integration is configured or that all endpoints have automated test coverage.

## ✨ Key Features

- 🔐 **Account & authentication** — authentication routes, JWT helpers, password hashing, and authorization middleware.
- ⚽ **Football analytics** — attacking, defensive, distribution, goalkeeper, set-piece, fouls, ratings, and market-value modules.
- 👥 **Player & team data** — player reports, teams, nationality, and transfer history.
- 💳 **Subscriptions & payments** — subscription, payment, Stripe, and PayPal integration code.
- 🖼️ **Media processing** — file-upload helpers, Cloudinary, AWS S3, and FFmpeg-related dependencies.
- 📧 **Communication** — contact and newsletter modules, email helper, and Google authentication configuration.
- 📊 **Dashboard** — dashboard API module.
- 🛡️ **API safeguards** — Zod validation helpers, centralized error handling, and configurable authentication middleware.
- ⏰ **Background jobs** — cron job handler.
- 🔌 **Real-time support** — Socket.IO dependency (verify active event wiring before relying on it).

## 🧰 Tech Stack

| Layer | Technologies |
| --- | --- |
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs, Google Auth Library |
| Validation | Zod |
| Payments | Stripe, PayPal integration code |
| Storage & media | AWS S3 SDK, Cloudinary, Multer, FFmpeg |
| Email | Nodemailer |
| Scheduling | node-cron |
| Real-time | Socket.IO |
| Developer tools | ESLint, Prettier, ts-node-dev |

## 🗂️ Project Structure

```text
src/
├── app.ts                         # Express app and middleware
├── server.ts                      # MongoDB connection and server startup
└── app/
    ├── config/                    # Environment-based configuration
    ├── error/                     # Application and database error helpers
    ├── helper/                    # JWT, uploads, email, jobs, payments, etc.
    ├── interface/                 # Shared TypeScript interfaces
    ├── middlewares/               # Authentication, validation, error handling
    ├── routes/
    │   └── routes.ts              # Central API route registry
    └── modules/
        ├── auth/                  # Authentication
        ├── user/                  # Users
        ├── team/                  # Teams
        ├── playerreport/          # Player reports
        ├── attackingstat/         # Attacking statistics
        ├── defensive/             # Defensive statistics
        ├── distributionstats/     # Distribution statistics
        ├── gkstats/               # Goalkeeper statistics
        ├── gkdistributionstats/   # Goalkeeper distribution
        ├── setpieces/             # Set-piece statistics
        ├── fouls/                 # Fouls
        ├── rating/                # Ratings
        ├── marketvalue/           # Market values
        ├── transferhistory/       # Transfer history
        ├── national/              # Nationality-related data
        ├── subscription/          # Subscriptions
        ├── payment/               # Payments
        ├── dashboard/             # Dashboard
        ├── contact/               # Contact
        ├── newsletter/            # Newsletter
        └── copon/                 # Coupon module (repository spelling)
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm (use a current Node.js LTS release compatible with the dependencies)
- A MongoDB database or MongoDB Atlas connection
- Credentials for any optional third-party integrations you intend to use

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure environment variables

Create a `.env` file in the project root. **Never commit this file.**

```dotenv
# Server
NODE_ENV=development
PORT=5010
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5010

# Database
MONGO_URI=mongodb://127.0.0.1:27017/analytics-soccer

# Authentication
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=1h
BCRYPT_SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=replace-with-a-different-random-secret
ACCESS_TOKEN_EXPIRES=7d
REFRESH_TOKEN_SECRET=replace-with-another-random-secret
REFRESH_TOKEN_EXPIRES=90d

# Email (when configured)
EMAIL_EXPIRES=900000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_ADDRESS=
EMAIL_PASS=
EMAIL_FROM=
EMAIL_TO=
ADMIN_EMAIL=

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Payments (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=

# Google authentication (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# Application settings
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
RATE_LIMIT_DELAY=50
```

> Some integrations may require additional provider-side setup. Check `src/app/config/index.ts`, the relevant module, and [`AUTH_SETUP.md`](./AUTH_SETUP.md) before enabling a feature. Values above are **examples**, not working credentials.

### 3. Start the development server

```bash
npm run dev
```

With `PORT=5010`, the API runs at:

```text
http://localhost:5010
```

Expected root response:

```json
{
  "message": "Welcome to the server"
}
```

### 4. Build and run

```bash
npm run build
npm start
```

## 🌐 API Routes

**Base URL:** `http://localhost:5010/api/v1`

The following prefixes are registered in `src/app/routes/routes.ts`:

| Module | Route prefix |
| --- | --- |
| Authentication | `/auth` |
| Users | `/user` |
| Teams | `/team` |
| Player reports | `/player-rapot` |
| Attacking statistics | `/attacking` |
| Defensive statistics | `/defensive` |
| Distribution statistics | `/distributionstats` |
| Goalkeeper statistics | `/gkstats` |
| Goalkeeper distribution | `/gkdistributionstats` |
| Set pieces | `/setpieces` |
| Fouls | `/fouls` |
| Ratings | `/rating` |
| Market value | `/marketvalue` |
| Transfer history | `/transferhistory` |
| National data | `/national` |
| Subscriptions | `/subscription` |
| Payments | `/payment` |
| Dashboard | `/dashboard` |
| Contact | `/contact` |
| Newsletter | `/newsletter` |
| Coupons | `/copon` |

**Additional endpoint:** `POST /api/paypal/webhook` is mounted outside the `/api/v1` prefix.

> These are **route prefixes**, not a complete endpoint reference. Consult each module's `*.routes.ts` for supported methods, full paths, middleware, and request payloads. Some names preserve the current spelling in the source code.

## 🏗️ Architecture

```text
HTTP Request
    │
    ▼
Express Middleware
    │
    ▼
Central Router
    │
    ▼
Feature Route → Controller → Service → Mongoose Model
    │
    ▼
MongoDB
    │
    ▼
HTTP Response / Error Handler
```

Each feature is organized into its own module with route, controller, service, and (where applicable) interface/model files. Shared helpers and middleware are kept outside individual modules.

## 🔒 Security & Configuration

- Keep `.env` and all service credentials out of version control.
- Generate unique, high-entropy JWT signing secrets for each environment.
- Restrict CORS origins before production deployment. **The current app uses a wildcard origin alongside `credentials: true`; review this configuration before deploying a browser client.**
- Validate payment webhook signatures and provider configuration in the relevant integration code.
- Rotate any credentials that were previously committed, published, or shared in documentation.
- Review role authorization and request validation for each protected route.

## 🧪 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run development server with automatic restarts |
| `npm run build` | Compile TypeScript |
| `npm start` | Start compiled server from `dist/server.js` |
| `npm run build-and-start` | Build and start |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Apply supported ESLint fixes |
| `npm run prettier` | Format source files |
| `npm run prettier:fix` | Format `src` |
| `npm test` | Placeholder only — no test suite is configured in `package.json` |

## 🚢 Deployment Checklist

1. Set production environment variables securely in the hosting platform.
2. Confirm database access and IP/network permissions.
3. Configure the frontend and backend origins correctly.
4. Configure OAuth redirect URIs and payment webhooks with each provider.
5. Review CORS, authentication, webhook verification, and secret management.
6. Run `npm ci` and `npm run build`.
7. Start the compiled server with `npm start` and check logs.
8. Test core routes and integrations in the deployed environment.

## 📚 Additional Documentation

- [`AUTH_SETUP.md`](./AUTH_SETUP.md) — email and Google sign-in setup notes, including local and production URL examples.
- `src/app/routes/routes.ts` — central route registry.
- `src/app/config/index.ts` — supported configuration keys.

## 📄 License

This project declares the **ISC** license in `package.json`. Confirm the intended licensing terms before public distribution.

---

<div align="center">

**Built with Node.js, Express, TypeScript & MongoDB** ⚽

*Analytics Soccer Backend API*

</div>
