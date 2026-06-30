# Nanny Services

Fullstack platform for finding, booking, and managing nanny services. Parents
can browse nanny profiles, manage favorites, create appointments, complete
meetings, and leave reviews. Nannies can maintain their profiles, manage
incoming appointment requests, and view parent feedback.

## Project Status

The MVP is implemented end to end:

- Express REST API with MongoDB persistence
- Next.js client application
- Role-based parent/nanny flows
- Appointment lifecycle and review flow
- Responsive UI based on the Nanny Services design

Google authentication is not included in the current scope and can be added as a
future improvement.

## Features

- Registration, login, logout, and JWT cookie authentication
- Parent and nanny roles
- Protected routes by role
- Public nanny catalog with pagination, sorting, and region filtering
- Favorites stored in MongoDB and synchronized after login
- Parent profile editing with avatar upload
- Nanny profile editing with completion status
- Cloudinary avatar uploads
- Appointment booking from nanny cards
- Incoming appointment management for nannies
- Parent appointment management
- Appointment statuses: pending, accepted, rejected, completed, cancelled
- Reviews for completed appointments
- Automatic nanny rating recalculation
- Reviews visible in nanny profile and completed incoming appointments
- Toast notifications for success and server/network errors
- Responsive layouts for desktop, tablet, and mobile

## Tech Stack

### Frontend

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- React Hook Form
- Zod
- Radix Dialog
- Lucide React

### Backend

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Celebrate and Joi
- Multer
- Cloudinary
- Vitest, Supertest, and mongodb-memory-server

## Repository Structure

```text
nanny-services-fullstack/
  backend/     Express REST API
  frontend/    Next.js client application
  docs/        Project documentation
```

## Getting Started

### Backend

```bash
cd backend
npm install
```

Create `.env` based on `backend/.env.example`:

```env
PORT=5000
MONGO_URL=mongodb+srv://...
JWT_SECRET=your-secret
NODE_ENV=development
JWT_EXPIRES_IN=1h
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Run the API:

```bash
npm run dev
```

The server will be available at:

```text
http://localhost:5000
```

Run backend tests:

```bash
npm test
```

Use watch mode while developing:

```bash
npm run test:watch
```

The integration tests use an isolated in-memory MongoDB instance. They do not
modify MongoDB Atlas data.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
API_URL=http://localhost:5000/api
```

For the deployed backend, use:

```env
API_URL=https://nanny-services-api.onrender.com/api
```

Run the client:

```bash
npm run dev
```

The client will be available at:

```text
http://localhost:3000
```

Run frontend checks:

```bash
npm run lint
npm run build
```

## API Documentation

REST API routes, authorization rules, query parameters, and sample request
bodies are documented in [docs/API.md](docs/API.md).

Interactive Scalar API documentation is available while the backend is running:

```text
http://localhost:5000/api-docs
```

## MongoDB Indexes

The database uses these unique indexes:

```text
users.email
nannies.userId
reviews.appointmentId
```

The `reviews.appointmentId` index is partial so imported seed reviews without
an appointment reference remain valid.

## Quality Checks

Before pushing a release-sized change, run:

```bash
cd backend
npm test
```

```bash
cd frontend
npm run lint
npm run build
```

## Design

The UI is based on the
[Nanny Services Figma design](https://www.figma.com/design/rfRPvTjaBi3oa80xNtF2i3/Nanny-Sevices--Copy-?node-id=0-1&m=dev).

## Deployment

- Backend API: [nanny-services-api.onrender.com](https://nanny-services-api.onrender.com/api/nannies)
- Interactive API documentation: [Scalar API Reference](https://nanny-services-api.onrender.com/api-docs)
- OpenAPI specification: [openapi.yaml](https://nanny-services-api.onrender.com/openapi.yaml)
- Database: MongoDB Atlas
- Frontend: Vercel-ready Next.js application
