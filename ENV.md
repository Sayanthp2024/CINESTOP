# 🔐 CineStop Environment Configuration (`.env.local`)

This document provides a detailed guide to configuring the environment variables for **CineStop** in `nextapp/.env.local`.

---

## 📌 Overview

The application requires specific environment variables to connect to MongoDB, communicate with The Movie Database (TMDB) API, encrypt authentication tokens with NextAuth, and power AI recommendations with Google Gemini.

> [!CAUTION]
> **Never commit `.env.local` to version control.** It contains sensitive connection strings and private API tokens. It is already included in `.gitignore`.

---

## 📋 Variables Reference Table

| Variable | Required | Default / Format | Description & Purpose |
|---|---|---|---|
| `MONGODB_URI` | **Yes** | `mongodb+srv://...` | MongoDB connection string (Atlas cloud or local MongoDB). Used for users, reviews, and custom movie storage. |
| `TMDB_API_KEY` | **Yes** | 32-character hex string | The Movie Database (TMDB) v3 API key. Used for fetching movies, trending lists, trailers, posters, and streaming availability. |
| `NEXTAUTH_SECRET` | **Yes** | 32+ character base64 string | Secret key used to encrypt and sign session JWT tokens for NextAuth authentication. |
| `NEXTAUTH_URL` | Optional | `http://localhost:3000` | Canonical root URL of the application. Required in production or custom callback domains. |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` or similar | Google Gemini API key. Powers Cine-Bot AI natural language movie recommendations. |

---

## 🛠️ Step-by-Step Setup Guide

### 1. MongoDB Connection String (`MONGODB_URI`)

- **Option A: MongoDB Atlas (Cloud)**
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and sign in.
  2. Create or select a cluster.
  3. Under **Database Access**, create a database user with read/write permissions.
  4. Under **Network Access**, whitelist your IP address (or `0.0.0.0/0` for development).
  5. Click **Connect** → **Drivers** (Node.js) and copy the connection string.
  6. Specify the database name (`/cinestop`) at the end of the URI.
  - *Example:*
    ```env
    MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/cinestop?retryWrites=true&w=majority"
    ```

- **Option B: Local MongoDB**
  ```env
  MONGODB_URI="mongodb://127.0.0.1:27017/cinestop"
  ```

> [!TIP]
> On Windows, DNS resolution for IPv6 can sometimes cause timeouts with MongoDB SRV records. The database connector in `src/lib/mongodb.ts` automatically specifies `family: 4` to enforce fast IPv4 resolution.

---

### 2. TMDB API Key (`TMDB_API_KEY`)

1. Create a free account at [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Navigate to **Settings** → **API** (`https://www.themoviedb.org/settings/api`).
3. Request an API key (Developer / Personal application).
4. Copy your **API Key (v3 auth)**.
5. Add it to `.env.local`:
   ```env
   TMDB_API_KEY="your_32_character_tmdb_api_key"
   ```

---

### 3. NextAuth Secret (`NEXTAUTH_SECRET`)

Generate a secure random string using OpenSSL or Node.js in your terminal:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add the generated secret to `.env.local`:
```env
NEXTAUTH_SECRET="your_generated_random_secret_here"
```

---

### 4. NextAuth URL (`NEXTAUTH_URL`)

- In local development, NextAuth automatically detects `http://localhost:3000`. You can optionally uncomment:
  ```env
  NEXTAUTH_URL="http://localhost:3000"
  ```
- When deploying to production (e.g. Vercel), set this to your live domain:
  ```env
  NEXTAUTH_URL="https://your-domain.com"
  ```

---

### 5. Google Gemini API Key (`GEMINI_API_KEY`)

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API Key**.
4. Add the key to `.env.local`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

> [!NOTE]
> If not added manually, you can also set or update this key directly within the CineStop web app via the Cine-Bot interface. The endpoint (`/api/chat/save-key`) validates the key with Google Gemini before persisting it into `.env.local`.

---

## 🧪 Verifying Configuration

After updating `.env.local`, you can test your database connection and environment configuration with:

```bash
# Seed default users and verify write access
npm run seed

# Inspect collections and active users in MongoDB
npm run check
```

---

## 📄 Example `.env.local` File

```env
# MongoDB Connection String (Required)
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/cinestop?retryWrites=true&w=majority"

# TMDB API Key (Required for fetching movies)
TMDB_API_KEY="your_tmdb_api_key_here"

# NextAuth Secret (Required for session encryption)
NEXTAUTH_SECRET="your_nextauth_secret_here"

# Base URL (Optional in development, required in production)
# NEXTAUTH_URL="http://localhost:3000"

# Google Gemini API Key (Required for Cine-Bot AI neural movie recommendations)
GEMINI_API_KEY="your_gemini_api_key_here"
```

