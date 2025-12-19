# AncientCMS - Technical Requirements & Architecture Document

**Date:** December 19, 2025
**Status:** MVP Implemented (Phase 1 Complete)
**Project Root:** `D:\Workhammer\ancient-cms`

## 1. Project Overview
**AncientCMS** is a high-performance, headless Content Management System designed with a distinct "Onyx & Gold" dark-mode aesthetic. It serves as the backend and content hub for personal portfolios, blogs, and project showcases.

### Core Philosophy
- **Headless**: API-first design. The backend allows any frontend to consume content.
- **Aesthetic**: "Super Cool" / "Cyber-Noir" / "Ancient Archives". Dark mode by default (`#0d0d0d`).
- **Monorepo**: Unified codebase for Server, Admin, and Public Website.

---

## 2. Technology Stack

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js (chosen for flexibility and speed).
- **Language**: TypeScript.
- **Database**: PostgreSQL (Dockerized).
- **ORM**: Prisma (for type-safe database access).
- **Auth**: JWT (JSON Web Tokens) + bcryptjs.
- **File Storage**: Local filesystem (`public/uploads`) via Multer (S3 compatible for future).

### Admin Frontend (`/admin`)
- **Framework**: React (Vite).
- **Styling**: Tailwind CSS + Custom "Ancient" Theme Configuration.
- **State Management**: TanStack Query (React Query) + Context API (Auth).
- **Icons**: Lucide React.
- **Routing**: React Router DOM v6.

### Public Website (`/website`)
- **Framework**: React (Vite).
- **Styling**: Tailwind CSS (Minimalist, Typography-driven).
- **Animations**: Framer Motion.

---

## 3. Data Architecture (Schema)

The database (PostgreSQL) is managed via Prisma. Key models include:

- **User**: Authentication & Roles (`ADMIN`, `EDITOR`, `AUTHOR`, `USER`).
- **Content Models**:
  - **Post**: Blog entries.
  - **Project**: Portfolio items.
  - **Story**: Narrative content.
  - *Shared Fields*: `slug`, `title`, `content` (JSON), `status` (Draft/Review/Published), `language`, `translationGroupId`.
- **Media**: File metadata (`url`, `mimetype`, `size`).

---

## 4. Current Implementation Status (Phase 1)

### ✅ Completed
1.  **Infrastructure**: Monorepo setup, Docker Compose for Postgres/Redis.
2.  **Backend Core**:
    - Auth Routes (`/register`, `/login`, `/me`).
    - Generic Content CRUD (`/content/:type`).
    - Media Upload & Serving.
3.  **Admin UI**:
    - **Authentication**: Login page with JWT handling.
    - **Dashboard**: Stats overview.
    - **Content Lists**: Data tables for Posts, Projects, Stories with status badges.
    - **Content Editor**: Create/Edit form with JSON/String content handling.
    - **Media Library**: Visual grid of uploaded assets + Copy URL feature.
4.  **Public Website**:
    - Home page listing published posts.
    - Detail page with smooth animations.

### 🚧 Work In Progress / Limitations
- **Content Editor**: Currently uses a raw HTML `<textarea>`. Needs a Rich Text Editor.
- **Localization**: Fields exist (`language`), but the UI to link translations is missing.
- **Auth**: Only Local (Email/Pass) is implemented. OAuth is planned.

---

## 5. Roadmap & Next Steps (Phase 2)

**When resuming development, start here:**

### Priority 1: Rich Text Editor
- **Task**: Replace the `<textarea>` in `ContentEditor.tsx` with **TipTap** or **Slate.js**.
- **Requirement**: Support bold, italic, lists, and **image insertion** from the Media Library.

### Priority 2: Authentication Hardening
- **Task**: Implement **Passport.js** for Social Login (GitHub/Google).
- **Task**: Add "Forgot Password" flow.

### Priority 3: Advanced Features
- **Settings Page**: Allow Admins to configure global site settings (SEO title, social links) - stored in a generic `KeyValue` table or JSON file.
- **Users Page**: Admin interface to manage users and roles.
- **Localization UI**: In `ContentEditor`, allow selecting a "Parent" article to link translations.

### Priority 4: Deployment
- **Docker**: Create a production `Dockerfile` for the Node server and Nginx for the React apps.

---

## 6. How to Resume
1.  **Check DB**: Ensure Docker is running (`docker-compose up -d`).
2.  **Start Server**: `cd server && npm run dev`.
3.  **Start Admin**: `cd admin && npm run dev`.
4.  **Reference**: This TRD is the source of truth.
