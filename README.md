# MediBook — MEAN Stack Hospital Appointment Platform

MediBook is a starter full-stack appointment booking platform built with MongoDB, Express, Angular and Node.js. It includes patient registration/login, doctor directory/search, appointment booking, appointment history and role-aware appointment status updates. Doctor/admin accounts are intended to be provisioned securely by an administrator; public registration always creates a patient account.

## Requirements
- Node.js 20.19+ (recommended) and npm
- MongoDB Atlas account or local MongoDB

## 1. Backend setup
Open a terminal:

```bash
cd server
npm install
```

Edit `server/.env` before starting. Set `JWT_SECRET` to a long random value and configure `MONGODB_URI` as described in the database section below.

```bash
npm run dev
```

API: `https://hirehub-xbmg.onrender.com/api`  
Health check: `https://hirehub-xbmg.onrender.com/api`

## 2. Frontend setup
Open a second terminal:

```bash
cd client
npm install
npm start
```

Open `http://localhost:4200`.

The Angular API address is configured in `client/src/environments/environment.ts`.

## MongoDB DNS / ECONNREFUSED note
This project deliberately rejects `mongodb+srv://` and uses a standard `mongodb://` seed-list connection string. This avoids the DNS SRV lookup (`querySrv`) that commonly causes `ECONNREFUSED` on some networks. In MongoDB Atlas, choose **Connect → Drivers** and obtain the standard/non-SRV seed-list URI if your Atlas interface offers it. Copy all three hostnames, the replica-set name, username and password exactly. URL-encode special characters in the password (for example `@` becomes `%40`). Do not guess hostnames or the replica-set name.

If your Atlas account only provides an SRV URI, use the Atlas-provided connection information to construct the standard seed-list URI, or ask your network administrator to allow DNS SRV queries. The non-SRV URI avoids the SRV lookup but still requires normal DNS resolution of each cluster hostname and outbound access to MongoDB Atlas. In Atlas **Network Access**, allow your current IP address. Never commit real database credentials.

For local MongoDB, use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/medibook
```

## Environment variables (`server/.env`)
- `PORT`: backend port (default 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: long random secret used to sign login tokens
- `CLIENT_URL`: frontend origin (local `http://localhost:4200`; set the deployed frontend origin for production)

## Main API routes
- `POST /api/auth/register` — patient registration
- `POST /api/auth/login` — login
- `GET /api/auth/me` — current account (Bearer token)
- `GET /api/doctors` — doctor directory; optional `search` and `specialization` query parameters
- `POST /api/appointments` — create patient appointment (Bearer token)
- `GET /api/appointments/mine` — current user's appointments
- `PATCH /api/appointments/:id/status` — authorized status update
- `GET /api/health` — API/database health

## Important first-run note
A newly created database has no doctors, so the doctor list will initially be empty. Create doctor accounts through a trusted admin-only provisioning process before using appointment booking. Do not make doctor/admin role selection publicly available in registration. This starter does not process payments, provide medical advice, or send email/SMS notifications.

## Deployment
Deploy the `server` directory as the backend service and the `client` directory as the Angular frontend. Set the backend environment variables in the hosting provider. Update `CLIENT_URL` to the exact deployed frontend origin and update `client/src/environments/environment.ts` `apiUrl` to the deployed backend API URL before building the frontend.
