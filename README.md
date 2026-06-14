# PropSpace

A property listing app where you can post places for rent or sale, browse and filter what others have posted, and manage your own listings. Built with React, Node/Express and MongoDB.

## What it does

- Sign up and log in (passwords are hashed, auth uses JWT)
- Browse all listings as a guest and filter by city and price
- Create, edit and delete your own listings once logged in
- A dashboard that shows only the listings you posted
- Edit your profile and change your password

## Tech

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)

## Getting started

Node 18+ and a MongoDB connection needed

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in:

```
PORT=5000
MONGO_URI=your mongodb connection string
JWT_SECRET=any long random string
JWT_EXPIRES_IN=7d
```

Generate `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then start it:

```bash
npm run dev
```



### 2. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints 

## API routes

| Method | Route | Who |
|--------|-------|-----|
| POST | /api/auth/register | anyone |
| POST | /api/auth/login | anyone |
| GET | /api/properties | anyone (supports ?city=, ?minPrice=, ?maxPrice=) |
| GET | /api/properties/:id | anyone |
| POST | /api/properties | logged in |
| PUT | /api/properties/:id | owner only |
| DELETE | /api/properties/:id | owner only |
| GET | /api/users/me | logged in |
| PUT | /api/users/me | logged in |
| PUT | /api/users/me/password | logged in |

## Notes

- Only the user who created a listing can edit or delete it. The check happens on the server, so it can't be bypassed from the frontend.
- Use `.env.example` as a reference for what to set.
