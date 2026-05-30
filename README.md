# Nanny Services

Fullstack platform for finding and booking nanny services. Parents can browse
nanny profiles, filter the catalog by region, manage favorites, create
appointments, and leave reviews after completed appointments. Nannies can
maintain their profiles and manage incoming requests.

## Project Status

The backend MVP is implemented. The frontend is currently a Next.js starter and
will be developed against the REST API.

## Features

- Registration and login with JWT authentication
- Parent and nanny roles
- Public nanny catalog with pagination
- Filtering by region and price
- Sorting by name, rating, and price
- Private nanny profile editing
- Persistent favorites stored in MongoDB
- Appointment lifecycle: pending, accepted, rejected, completed, cancelled
- Reviews for completed appointments
- Automatic nanny rating recalculation

## Tech Stack

### Frontend

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Zustand

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Celebrate and Joi

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
```

Run the API:

```bash
npm run dev
```

The server will be available at `http://localhost:5000`.

### MongoDB Indexes

The database uses these unique indexes:

```text
nannies.userId
reviews.appointmentId
```

The `reviews.appointmentId` index is partial so that imported seed reviews
without an appointment reference remain valid.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The client will be available at `http://localhost:3000`.

## API Documentation

REST API routes, authorization rules, query parameters, and sample request
bodies are documented in [docs/API.md](docs/API.md).

Interactive Scalar API documentation is available while the backend is running:

```text
http://localhost:5000/api-docs
```

## Design

The UI will be based on the
[Nanny Services Figma design](https://www.figma.com/design/rfRPvTjaBi3oa80xNtF2i3/Nanny-Sevices--Copy-?node-id=0-1&m=dev).

## Deployment

Planned deployment:

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
