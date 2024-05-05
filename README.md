# Realtime Auth Dashboard
This is simple PoC design for Realtime account monitoring using Socket.io in Nodejs.

# Features
- User Authentication (email + pass)
- RBAC (user, admin)
- Twofactor Verification via email
- User dashboard
  - all devices (logged in/out)
  - logs (all previous activities)
  - Device details
  - Upgrade account to `admin`
- Admin dashboard
  - All Users
  - All Activities (global)
  - Access any account
- Realtime System
  - realtime logs/activities
  - for both local + global(admin level)
- Emails for each event
- IP blocking after 3 wrong attempts
- Admin can logout any user/device
- Easy deployment (Vercel + Dockerfile)

# Tech Stack
- Frontend
  - NextJS (RTE + UI Framework)
  - ChakraUI (UI Framework)
  - socket.io-client (Socket connection)
  - react-icons + iconsax
  - Visitor API (device telemetry)
- Backend
  - NodeJS (RTE)
  - ExpressJS (Web Server)
  - bcryptJS (Password hashing)
  - jsonwebtoken (signing auth tokens)
  - nodemailer (SNTP client for sending Emails)
  - socket.io (socket server)
  - zod (schema validation)
  - redis (redis client)
  - pg (postgres client)
  - typeorm (Database ORM)
  - envoix (Env management) (I built this)
  - Docker + Docker compose (containerisation + deployment)
  - Azure (Cloud VM)
- Database
  - Postgres (Persistent User + device data)
  - Redis (IP ban, OTPs, logs, events, pub/sub, etc)
# Architecture
![image](https://github.com/theanuragshukla/realtime-auth-dashboard/assets/71091279/a62bc000-9833-44da-8b70-f6a16bef3051)

