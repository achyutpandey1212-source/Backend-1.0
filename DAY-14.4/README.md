# Insta Clone (Full-Stack)

A full-stack Instagram-style social app with authentication, profiles, posts, comments, likes, bookmarks, follow requests, and a polished responsive UI. The frontend is built with React + Vite and SCSS. The backend is a Node/Express API with MongoDB/Mongoose, JWT auth in HTTP-only cookies, and ImageKit for media uploads. The production build is served from the backend `public` directory.

## Highlights
- End-to-end auth with secure cookies and protected routes
- Private/public accounts with follow requests and notifications
- Post creation, edit, delete, like, bookmark, and comments
- Modern post card layout, mobile-first navigation, and search
- Deployment-ready setup (backend serves frontend build)

## Features
- Authentication: register, login, logout with JWT stored in HTTP-only cookies
- Profiles: complete/edit profile, avatar upload, bio, private/public toggle
- Posts: create, edit, delete, like, bookmark
- Social: follow requests, accept/reject, notifications
- Comments: add and delete
- UI/UX: responsive layout, mobile nav, search, polished cards and forms

## Tech Stack
Frontend:
- React (Vite)
- React Router
- Axios
- SCSS

Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Cookie Parser
- Multer
- ImageKit

Deployment:
- Render (backend serves frontend build)

## Project Structure
```
DAY-14.4/
  Backend/
    public/           # Built frontend (Vite dist)
    src/
      app.js
      routes/
      controllers/
      models/
      config/
    server.js
    package.json
  Frontend/
    src/
      components/
      features/
    package.json
```

## Local Setup
1) Install dependencies
```
cd DAY-14.4/Backend
npm install

cd ../Frontend
npm install
```

2) Create backend environment variables
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
CORS_ORIGIN=http://localhost:5173
```

3) Run backend (terminal 1)
```
cd DAY-14.4/Backend
npm run dev
```

4) Run frontend (terminal 2)
```
cd DAY-14.4/Frontend
npm run dev
```

## Frontend Build (Production)
Build the frontend and move output into the backend:
```
cd DAY-14.4/Frontend
npm run build

# copy Frontend/dist into Backend/public
```

Start the backend:
```
cd DAY-14.4/Backend
npm start
```

## Environment Variables (Production)
Backend:
- `MONGO_URI`
- `JWT_SECRET`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `CORS_ORIGIN` (your live URL, e.g. https://your-app.onrender.com)

Frontend:
- `VITE_API_URL` (optional). If omitted, the app calls same-origin `/api/*`.

## Deployment Notes (Render)
Recommended settings:
- Root Directory: `DAY-14.4/Backend`
- Build Command: `npm install`
- Start Command: `npm start`

Make sure the frontend build is present in `Backend/public` before deploying.

## Credits
Built as a full-stack learning project to master authentication, media uploads, and modern UI/UX patterns.
