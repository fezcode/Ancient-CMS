# AncientCMS 🏛️

A modern, headless CMS with a "super cool" dark-mode aesthetic.

## 📚 Documentation
- [**Architecture & Design**](../docs/ARCHITECTURE.md)
- [**Database Management**](../docs/DATABASE.md) (How to switch DBs)
- [**API Reference**](../docs/API.md)

## Features
- **Monorepo Structure**: Backend, Admin, and Website in one place.
- **Robust Tech Stack**: Node.js, TypeScript, Express, Prisma, PostgreSQL.
- **Cool UI**: Admin dashboard with "Onyx" dark theme and gold accents.
- **Activity Tracking**: Real-time charts and system health monitoring.
- **Media dependency checks**: Prevents deleting images used in posts.

## Quick Start

### 1. Database
```bash
docker-compose up -d
```

### 2. Server
```bash
cd server
npm install
npm run dev
```

### 3. Admin Panel
```bash
cd admin
npm install
npm run dev
```

### 4. Website
```bash
cd website
npm install
npm run dev
```

