# API Reference

Base URL: `http://localhost:3001/api`

## Authentication
- **POST** `/auth/register`: Create a new account. (First user becomes ADMIN).
- **POST** `/auth/login`: Authenticate and receive JWT.
- **GET** `/auth/me`: Get current user profile.

## Content (Posts, Projects, Stories)
Replace `:type` with `posts`, `projects`, or `stories`.

- **GET** `/content/:type`: List all items.
- **GET** `/content/:type/:id`: Get single item details.
- **POST** `/content/:type`: Create new item.
- **PUT** `/content/:type/:id`: Update item.
- **DELETE** `/content/:type/:id`: Delete item.

## Media
- **GET** `/media`: List all uploaded files.
- **POST** `/media/upload`: Upload a file (`multipart/form-data`).
- **DELETE** `/media/:id`: Delete file (checks usage first).
- **GET** `/media/:id/usage`: Check where a file is being used.

## Statistics & System
- **GET** `/content/stats`: Dashboard counts (Posts, Users, etc.).
- **GET** `/content/stats/chart`: 7-day activity data.
- **GET** `/system/health`: Server status, storage, and DB latency.
