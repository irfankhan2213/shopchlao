# Shop Chlao Backend

This backend server is built with Node.js, Express, MongoDB, and TypeScript. It provides RESTful APIs for user registration (sign-up) and authentication (sign-in) to connect with the Shop Chlao frontend forms.

## Setup

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Configure environment variables in `.env` (see sample in repo).
3. Start the development server:
   ```sh
   pnpm dev
   ```

## API Endpoints

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/signin` — Authenticate an existing user

## Project Structure

- `src/index.ts` — Main server entry point
- `src/routes/auth.ts` — Auth routes
- `src/models/User.ts` — User model

## Notes
- Ensure MongoDB is running locally or update `MONGO_URI` in `.env` for your setup.
- Replace `JWT_SECRET` in `.env` with a secure value for production.
# shop-chloa-backend
