# GitHub Copilot Instructions for Kairo

## Project Overview

Kairo is a personal web dashboard built with Node.js, Express.js, MongoDB, and Handlebars templating. It allows users to organize bookmarks (favorites), notes, collections, and browsing history. A Chrome extension is included for quick saves from the browser.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **View Engine:** Handlebars (hbs / express-handlebars)
- **Authentication:** express-session + bcryptjs
- **Validation:** express-validator
- **Session Store:** connect-mongo (MongoDB-backed sessions)
- **Frontend:** Vanilla JavaScript, CSS (no framework)
- **Extension:** Chrome Manifest v3

## Project Structure

```
Kairo/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Business logic (auth, dashboard, notes, favorites, collections, history)
│   ├── middleware/auth.js      # requireAuth, redirectIfAuthenticated, attachUser
│   ├── models/                 # Mongoose schemas (User, Note, Favorite, Collection, History)
│   └── routes/                 # Express route definitions
├── extension/                  # Chrome browser extension (Manifest v3)
├── public/                     # Static assets (CSS, images)
├── views/                      # Handlebars templates (.hbs)
└── server.js                   # Express app entry point
```

## Coding Conventions

- Use `async/await` with try/catch for all async operations.
- Controllers return JSON responses for `/api` routes and render views for page routes.
- All authenticated routes use the `requireAuth` middleware.
- History entries should be logged after any create/update/delete action using the `History` model.
- Mongoose models use timestamps (`{ timestamps: true }`) for `createdAt`/`updatedAt`.
- Environment variables are loaded via `dotenv` from a `.env` file; never hardcode secrets.
- Error responses should use consistent JSON format: `{ success: false, message: '...' }`.
- Success responses should use: `{ success: true, data: ... }` or similar consistent structure.

## Model Conventions

- Reference the authenticated user via `req.session.userId` (ObjectId).
- Always scope queries to the current user: `{ userId: req.session.userId }`.
- Use `lean()` on Mongoose queries when you only need plain JavaScript objects.

## Route Conventions

- API endpoints are prefixed with `/api` within each route file (e.g., `/notes/api`).
- Page routes render `.hbs` templates in the `views/` directory.
- Use RESTful patterns: GET for read, POST for create, PUT for update, DELETE for delete.

## Frontend Conventions

- Vanilla JavaScript with `fetch` API for AJAX calls to the backend.
- Use `async/await` in client-side scripts.
- Show user-friendly error and success messages inline (avoid `alert()`).

## Chrome Extension

- The extension connects to `http://localhost:3000` in development.
- It checks session validity via `GET /api/session-check`.
- Saves links to Favorites, History, or a Collection via the existing API endpoints.

## Security Notes

- Passwords are hashed with bcryptjs before storing.
- Sessions use HTTP-only cookies in production.
- Always validate and sanitize user inputs using `express-validator`.
- Never expose internal error details to users in production (`NODE_ENV === 'production'`).
