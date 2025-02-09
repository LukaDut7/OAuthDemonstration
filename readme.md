# OAuthDemonstration

A TypeScript-based **OAuth 2.0 Authorization Code Flow** server using **Express**, **TypeORM**, **SQLite**, and **express-session**. This project demonstrates:

1. How to implement the OAuth 2.0 Authorization Code Flow (with `grant_type=authorization_code` and `grant_type=refresh_token`).
2. **Custom user authentication** (manual login) and session management using `express-session`.
3. Generating **JWT** tokens via [jose](https://github.com/panva/jose).
4. Storing OAuth codes and tokens in a **SQLite** database (via TypeORM).

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Running the Project](#running-the-project)
- [Testing the Flow](#testing-the-flow)

## Features

1. **Authorization Endpoint** (`/api/oauth/authorize`): Issues authorization codes after validating a logged-in user and the requesting client.
2. **Token Endpoint** (`/api/oauth/token`): Exchanges authorization codes for JWT access tokens and optional refresh tokens.
3. **Refresh Token** support (`grant_type=refresh_token`).
4. **User Login** (`/login`): A custom form-based login flow that sets `req.session.userId`.
5. In-memory or file-based **SQLite** database using TypeORM for persistent storage of users, codes, tokens, etc.

## Quick Start

1. **Clone** this repository (or copy the files to your machine).
2. **Install** dependencies:
   `npm install`
3. **Build** the TypeScript code:
   `npm run build`
4. **Start** the server:
   `npm start`

The app listens by default on port `8080` (configurable via `.env`).

## Running the Project

### 1. Install Dependencies

`npm install`

### 2. Environment Variables

Ensure you have a `.env` file in the project root. For example:

```
PORT=8080
SESSION_SECRET=supersecret
JWT_ALGORITHM=RS256
```

### 3. A single OAuth client

```
OAUTH_CLIENT_ID=upfirst
OAUTH_CLIENT_REDIRECT_URI=http://localhost:8081/process
```

### 4. Build & Start

```
npm run build
npm start
```

This compiles TypeScript into `dist/` and launches the server on http://localhost:8080.

To run in **development mode** with live reload, you can install ts-node-dev:

```
npm install --save-dev ts-node-dev
npx ts-node-dev src/server.ts
```

## Environment Variables


| Variable                  | Description                          | Default                       |
| ------------------------- | ------------------------------------ | ----------------------------- |
| PORT                      | Port the server listens on.          | 8080                          |
| SESSION_SECRET            | Session secret for`express-session`. | supersecret                   |
| JWT_ALGORITHM             | JWT signing algorithm (e.g.`RS256`). | RS256                         |
| PRIVATE_KEY_PEM           | Private key in PKCS#8 format.        | *(none)*                      |
| OAUTH_CLIENT_ID           | Demo client ID.                      | upfirst                       |
| OAUTH_CLIENT_REDIRECT_URI | Demo client redirect URI.            | http://localhost:8081/process |

**Warning**: In production, **never** commit secrets to version control. Use a secure secrets manager or environment-specific approach.

## Testing the Flow

1. **Login**:

   - Open `http://localhost:8080/login` in your browser.
   - Use the seeded user (username: `testuser`, password: `password`) to sign in.
2. **Authorize**:

   - Navigate to:

     ```
     http://localhost:8080/api/oauth/authorize?response_type=code&client_id=upfirst&redirect_uri=http://localhost:8081/process&state=SOME_STATE
     ```
   - If successful, you will be redirected to:
     `http://localhost:8081/process?code=SOME_CODE&state=SOME_STATE`
3. **Exchange Code for Token**:

   - Make a POST request to `http://localhost:8080/api/oauth/token` with Content-Type: `application/x-www-form-urlencoded`:

     ```
     curl -X POST http://localhost:8080/api/oauth/token
     -H "Content-Type: application/x-www-form-urlencoded"
     -d "grant_type=authorization_code"
     -d "code=SOME_CODE"
     -d "client_id=upfirst"
     -d "redirect_uri=http://localhost:8081/process"
     ```
   - Expect a JSON response containing `access_token`, `token_type`, `expires_in`, and `refresh_token`.
4. **Refresh Token** (optional):

   ```
   curl -X POST http://localhost:8080/api/oauth/token
   -H "Content-Type: application/x-www-form-urlencoded"
   -d "grant_type=refresh_token"
   -d "refresh_token=SOME_REFRESH_TOKEN"
   -d "client_id=upfirst"
   ```
