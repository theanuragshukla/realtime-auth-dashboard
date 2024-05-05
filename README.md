# Realtime Auth Dashboard
This is simple PoC design for Realtime account monitoring using Socket.io in Nodejs.

# Deployments
- Client: [`https://realtime-auth-dashboard.vercel.app`](https://realtime-auth-dashboard.vercel.app)
- Server: [`https://authdash.anurags.tech/`](https://authdash.anurags.tech/)

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
  - nodemailer (SMTP client for sending Emails)
  - socket.io (socket server)
  - zod (schema validation)
  - redis (redis client)
  - pg (postgres client)
  - typeorm (Database ORM)
  - envoix (Env management) [[theanuragshukla/envoix](https://github.com/theanuragshukla/envoix)]
  - Docker + Docker compose (containerisation + deployment)
  - Azure (Cloud VM)
- Database
  - Postgres (Persistent User + device data)
  - Redis (IP ban, OTPs, logs, events, pub/sub, etc)
# Architecture
![image](https://github.com/theanuragshukla/realtime-auth-dashboard/assets/71091279/a62bc000-9833-44da-8b70-f6a16bef3051)

### REST API Routes ([READ MORE ABOUT ROUTES](./server/src/controllers/README.md))
- /auth - [`NO AUTH`]
  - `POST` /login 
  - `POST` /register
  - `POST` /verify
  - `GET` /profile
- /account - [`USER` + `ADMIN`]
  - `GET` /recent-devices
  - `GET` /recent-activities
  - `GET` /all-activities
  - `GET` /logout-device/:deviceId
  - `GET` /device/:deviceId
  - `GET` /upgrade
- /users - [`ADMIN`]
  - `GET` /all
  - `GET` /:uid
  - `DELETE` /:uid

### REALTIME SYSTEM
- Server: `Socket.io`
- Authentication: AuthToken via cookies (http-only)

#### Working 
- After User connects, If Authorised, gets added to their Unique room, where all their activities are broadcasted
- ADMIN can specify `forUID` in `handshake.query`, to join any users room or set it to admin for global events/logs
- every activity is broadcasted to two rooms
  1. User' room (UID)
  2. Admin channel (global)
- Activities are added broadcasted by [`REDIS CONSUMER`](#redis)

### REDIS
- Their are two redis instances running
  1. PUB: Publishes all activites to redisDB
  2. SUB: Consumes activities and takes actions accordingly
- Actions:
  1. OTP
  - saves the users OPT for 2FA (Expire time: 10min)
  2. BAN
  - Saves User's IP as banned (Expire time: 2hrs)
  3. LOG
  - sends new logs through admin and user channels

### MAILER
- Service: `nodemailer`
- Sends email to users

# Author
developed by [`Anurag Shukla`](https://github.com/theanuragshukla)
