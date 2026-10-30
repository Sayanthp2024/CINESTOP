# 🎬 CineStop (The Toxic Vault) – Next.js Movie Discovery & Recommendation Platform

A modern, full-stack cinematic web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **MongoDB (Mongoose)**, **NextAuth.js**, **The Movie Database (TMDB) API**, and **Google Gemini AI**.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Environment Variables (.env.local)](#environment-variables-envlocal)
- [Getting Started](#getting-started)
- [Database Seeding & Test Credentials](#database-seeding--test-credentials)
- [Project Architecture & Directory Layout](#project-architecture--directory-layout)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)

---

## 🌟 Overview

**CineStop** (themed as *"The Toxic Vault"*) provides an underground, chaotic, and visually striking cinematic experience. Unlike generic movie browsers, CineStop combines real-time streaming availability, official trailers, curated chaos categories, full user review systems, and an integrated **Cine-Bot AI assistant** powered by Google Gemini for intelligent, natural-language movie recommendations.

---

## ⚡ Key Features

- 🤖 **Cine-Bot (AI Recommendation Engine)**: Powered by Google Gemini with multi-model fallback (`gemini-2.5-flash`, `gemini-2.0-flash`, etc.). Parses freeform natural language prompts (e.g., *"mind-bending sci-fi with time loops"*) into TMDB genres and recommendations.
- 🎬 **Dynamic TMDB Catalog**: Instant access to Trending, Top Rated, and Popular releases, complete with poster art, ratings, release years, and genre stickers.
- 📡 **Where to Stream Radar & Trailers**: Real-time streaming provider availability badges (Netflix, Prime, Disney+, etc.) and embedded official YouTube trailers.
- 🔐 **Authentication & Role-Based Access (NextAuth)**: Secure JWT session management with credentials login, bcrypt password hashing, and user/admin role distinction.
- 📋 **Watchlist & Favorites**: Persistent user-specific movie lists stored in MongoDB.
- ⭐ **Community Reviews & Ratings**: Submit, view, and manage 1–5 star reviews with community ratings.
- 🛡️ **Admin Command Center (`/admin`)**: Dedicated dashboard for monitoring database connectivity status, managing registered users, creating custom movies, moderating reviews, and one-click database re-seeding.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.3.8 (App Router, Turbopack / Webpack support)
- **Frontend**: React 19.2.8, Tailwind CSS v4, FontAwesome Icons
- **Database & ODM**: MongoDB Atlas / Local MongoDB with Mongoose 9.10.4
- **Authentication**: NextAuth.js 4.24.15 (JWT session strategy, Credentials Provider)
- **Security**: bcryptjs 3.0.3 password hashing
- **External APIs**: 
  - [The Movie Database (TMDB) v3 API](https://www.themoviedb.org/settings/api)
  - [Google Gemini Generative AI API](https://aistudio.google.com/app/apikey)

---

## 🔐 Environment Variables (`.env.local`)

The application expects its configuration in `.env.local` located in the `nextapp/` directory.

### Quick Setup

Create `.env.local` from the provided example template:

```bash
cp .env.example .env.local
```

### Configuration Variables Breakdown

| Variable | Required | Description | Example / Source |
|---|---|---|---|
| `MONGODB_URI` | **Yes** | Connection string for MongoDB (Atlas cloud cluster or local instance). | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/cinestop?retryWrites=true&w=majority` |
| `TMDB_API_KEY` | **Yes** | API key for fetching movie metadata, posters, trailers, and streaming providers. | Get a free key at [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `NEXTAUTH_SECRET` | **Yes** | 32+ character random secret used to sign and encrypt NextAuth session JWT tokens. | Generate via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Optional | Canonical application URL. Defaults to `http://localhost:3000` in local development. | `http://localhost:3000` (or your production domain) |
| `GEMINI_API_KEY` | Optional | Google AI Studio API key powering the Cine-Bot AI recommendation chatbot. | Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey) |

> [!NOTE]
> When `GEMINI_API_KEY` is not initially set in `.env.local`, the in-app Cine-Bot provides a settings dialog in the UI allowing users/admins to test and save their key directly through `/api/chat/save-key`.

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `18.18+` or `20.x+`
- **npm** (or `pnpm` / `yarn`)
- A MongoDB cluster or local MongoDB instance

### 2. Installation

Navigate into the `nextapp` directory and install dependencies:

```bash
cd nextapp
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env.local` and populate your credentials:

```bash
cp .env.example .env.local
```

### 4. Seed Database (Initial Setup)

Populate default admin accounts, sample users, reviews, and test movies:

```bash
npm run seed
```

Verify the database collections and users:

```bash
npm run check
```

### 5. Launch the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Seeding & Test Credentials

Running `npm run seed` (`node seed-users.js`) automatically provisions sample accounts with hashed passwords:

| Role | Name | Email | Password | Default Data |
|---|---|---|---|---|
| **Admin** | System Commander | `admin@cinestop.com` | `admin123` | Full admin privileges + sample watchlist & favorites |
| **Admin** | Vault Overseer | `admin@movie.com` | `admin123` | Full admin privileges |
| **User** | Sayanth Cinema | `user@cinestop.com` | `user123` | Standard user with watchlist & favorites |
| **User** | Neo Celluloid | `neo@cinestop.com` | `user123` | Standard user |

> [!TIP]
> You can re-seed or reset accounts at any time by running `npm run seed` in your terminal or clicking **Run Database Seeder** inside the `/admin` dashboard.

---

## 📁 Project Architecture & Directory Layout

```
nextapp/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── admin/          # Admin Dashboard page (/admin)
│   │   ├── chatbot/        # Dedicated AI recommendation assistant page
│   │   ├── favorites/      # User favorites page (/favorites)
│   │   ├── genres/         # Genre explore page (/genres)
│   │   ├── login/          # User login page (/login)
│   │   ├── movie/[id]/     # Dynamic movie details, trailer, & stream radar
│   │   ├── movies/         # Vault catalog with search and filters
│   │   ├── profile/        # User profile page
│   │   ├── recommendations/# Personalized recommendations page
│   │   ├── register/       # New user registration page
│   │   ├── reviews/        # Community reviews page
│   │   ├── trending/       # Trending movies feed
│   │   ├── watchlist/      # User watchlist page
│   │   ├── api/            # API Route handlers
│   │   │   ├── admin/      # Admin endpoints (db-status, movies, reviews, seed, users)
│   │   │   ├── auth/       # NextAuth handler & registration endpoint
│   │   │   ├── chat/       # AI recommendations & save-key endpoints
│   │   │   ├── movies/     # TMDB proxy (popular, trending, search, details)
│   │   │   ├── reviews/    # Review CRUD operations
│   │   │   └── user/       # User profile, movies, reviews, recommendations
│   │   ├── layout.tsx      # Root layout with Navbar, CineBot, and Session Providers
│   │   └── page.tsx        # Toxic Vault Hero Home page
│   ├── components/         # Reusable UI components
│   │   ├── CineBot.tsx     # Floating / modal Gemini AI recommendation bot
│   │   ├── DynamicMovieGrid.tsx # Movie grid with interactive modals & badges
│   │   ├── Navbar.tsx      # Main navigation header with auth state
│   │   ├── PopularFlicks.tsx    # Carousel / grid of popular titles
│   │   └── Providers.tsx   # Client session wrapper (SessionProvider)
│   ├── lib/                # Core utility singletons
│   │   ├── auth.ts         # NextAuth configuration and credentials logic
│   │   ├── mongodb.ts      # Mongoose connection manager with hot-reload cache
│   │   └── tmdb.ts         # TMDB API client with retry mechanism
│   ├── models/             # Mongoose database models
│   │   ├── Movie.ts        # Custom movie schema
│   │   ├── Review.ts       # Review schema (user ref, movieId, rating, text)
│   │   └── User.ts         # User schema (name, email, role, watchlist, favorites)
│   └── middleware.ts       # Route protection middleware
├── .env.example            # Environment variables example template
├── .env.local              # Local environment configuration (ignored by git)
├── seed-users.js           # CLI database seeding script
├── check-users.js          # CLI database verification script
├── test-mongo.js           # Lightweight MongoDB ping test script
└── package.json            # Scripts & project dependencies
```

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` – Register a new user (`name, email, password`).
- `GET/POST /api/auth/[...nextauth]` – NextAuth session, login, and callback handler.

### 🎬 Movies (`/api/movies`)
- `GET /api/movies/popular` – Retrieve popular movies from TMDB.
- `GET /api/movies/trending` – Retrieve current trending movies.
- `GET /api/movies/search?q={query}` – Search movies by title.
- `GET /api/movies/details?id={id}` – Retrieve movie details, trailers, credits, and streaming availability.

### 🤖 Cine-Bot AI Chat (`/api/chat`)
- `GET /api/chat/recommendations` – Check if Gemini API key is configured and get supported models.
- `POST /api/chat/recommendations` – Query Cine-Bot with natural language for movie recommendations.
- `POST /api/chat/save-key` – Test, validate, and persist a user-provided Gemini API key into `.env.local`.

### 👤 User Data (`/api/user`)
- `GET /api/user/profile` – Fetch current user profile.
- `GET /api/user/movies` – Fetch user's current watchlist and favorites IDs.
- `POST /api/user/movies` – Add/remove movie to/from watchlist or favorites (`{ movieId, action: 'add'|'remove', list: 'watchlist'|'favorites' }`).
- `GET /api/user/reviews` – Retrieve reviews posted by the current user.
- `GET /api/user/recommendations` – Personalized recommendations based on user favorites and top genres.

### ⭐ Reviews (`/api/reviews`)
- `GET /api/reviews?movieId={id}` – Fetch community reviews for a specific movie.
- `POST /api/reviews` – Create or update a review (`{ movieId, rating, text }`).
- `DELETE /api/reviews?id={reviewId}` – Delete a review (author or admin only).

### 🛡️ Admin (`/api/admin`) *(Admin Role Required)*
- `GET /api/admin/db-status` – Test connection and count documents across collections.
- `GET /api/admin/users` – List all registered users.
- `DELETE /api/admin/users?id={id}` – Delete a user account.
- `GET /api/admin/reviews` – List all reviews across the platform.
- `DELETE /api/admin/reviews?id={id}` – Moderate and delete any review.
- `GET /api/admin/movies` – List custom database movies.
- `POST /api/admin/movies` – Create a custom movie record.
- `POST /api/admin/seed` – One-click database re-seeder.

---

## 📜 Available Scripts

Run these scripts from within the `nextapp/` directory (or from workspace root with `npm run <script>`):

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev --webpack` | Starts the Next.js development server at [http://localhost:3000](http://localhost:3000). |
| `build` | `next build --webpack` | Compiles the production build. |
| `start` | `next start` | Runs the compiled production server. |
| `lint` | `eslint` | Runs ESLint code style and syntax checks. |
| `seed` | `node seed-users.js` | Connects to MongoDB, seeds initial test users, admins, movies, and sample reviews. |
| `check` | `node check-users.js` | Pings MongoDB, logs current collections, and displays all registered users and their roles. |
