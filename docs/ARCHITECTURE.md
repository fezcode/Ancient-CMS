# AncientCMS Architecture

## Overview
AncientCMS is a **monorepo** full-stack Headless CMS designed for performance, modularity, and a premium "Onyx" aesthetic.

### System Diagram
```mermaid
graph TD
    User[User / Visitor] -->|HTTPS| Website[Public Website (React)]
    Admin[Administrator] -->|HTTPS| Dashboard[Admin Panel (React)]
    
    Website -->|REST API| API[Node.js / Express Server]
    Dashboard -->|REST API| API
    
    subgraph Backend
    API -->|Prisma ORM| DB[(PostgreSQL)]
    API -->|FS| Uploads[File System / Uploads]
    end
```

## Directory Structure
- **`server/`**: The backend API.
  - **`src/controllers/`**: Logic for handling requests.
  - **`src/routes/`**: API endpoint definitions.
  - **`src/middleware/`**: Auth and security checks.
  - **`prisma/`**: Database schema and migrations.
- **`admin/`**: The dashboard for content management.
  - Built with React, Vite, Tailwind CSS, and TanStack Query.
- **`website/`**: The public-facing frontend.
  - Optimized for read-heavy traffic.

## Key Technologies
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL with Prisma ORM.
- **Frontend**: React (Vite), Tailwind CSS (v3).
- **Authentication**: JWT (JSON Web Tokens).
- **Visualization**: Recharts for analytics.

