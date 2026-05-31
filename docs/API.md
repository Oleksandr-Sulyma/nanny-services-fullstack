# Nanny Services REST API

Base URL for local development:

```text
http://localhost:5000/api
```

Interactive Scalar API documentation is available at:

```text
http://localhost:5000/api-docs
```

Protected routes require an access token:

```http
Authorization: Bearer <token>
```

## Health Check

```http
GET /health
```

Returns `200` when the API server is running.

## Authentication

### Register

```http
POST /auth/register
```

Body:

```json
{
  "name": "Oleksandr Sulyma",
  "email": "parent@example.com",
  "password": "StrongPass123!",
  "role": "parent"
}
```

Allowed roles: `parent`, `nanny`.

### Login

```http
POST /auth/login
```

Body:

```json
{
  "email": "parent@example.com",
  "password": "StrongPass123!"
}
```

The response contains the JWT token required for protected routes.

### Logout

```http
POST /auth/logout
```

Authentication required. The client must remove the JWT token after logout.

## Users

### Get Current User

```http
GET /users/me
```

Authentication required. Favorites are populated with available nanny profiles.

### Update Avatar

```http
PATCH /users/avatar
```

Authentication required.

Body:

```json
{
  "avatar": "https://example.com/avatar.jpg"
}
```

### Update Password

```http
PATCH /users/update-password
```

Authentication required.

Body:

```json
{
  "oldPassword": "StrongPass123!",
  "newPassword": "NewStrongPass456!"
}
```

### Toggle Favorite Nanny

```http
POST /users/favorites
```

Authentication required.

Body:

```json
{
  "nannyId": "0cef122f685b662efedcab95"
}
```

Calling the route again with the same ID removes the nanny from favorites.

## Nannies

### Get Nannies

```http
GET /nannies
```

Available query parameters:

| Parameter | Default | Allowed values |
| --- | --- | --- |
| `page` | `1` | Positive integer |
| `perPage` | `3` | Integer from `3` to `20` |
| `region` | - | Region name, case-insensitive |
| `sort` | `a_to_z` | `a_to_z`, `z_to_a`, `popular`, `not_popular`, `price_asc`, `price_desc` |
| `filter` | `show_all` | `less_than_18`, `greater_than_18`, `show_all` |

Example:

```http
GET /nannies?page=1&perPage=3&region=kyiv%20oblast&sort=price_desc
```

### Get Nanny Details

```http
GET /nannies/:nannyId
```

Returns a completed nanny profile and its reviews.

### Get Own Nanny Profile

```http
GET /nannies/me
```

Authentication required. Role: `nanny`.

### Update Own Nanny Profile

```http
PATCH /nannies/me
```

Authentication required. Role: `nanny`.

Body may contain one or more profile fields:

```json
{
  "avatar_url": "https://example.com/nanny.jpg",
  "birthday": "1994-04-10",
  "experience": "6 years",
  "education": "Master's in Early Childhood Development",
  "kids_age": "2 to 9 years old",
  "price_per_hour": 20,
  "location": {
    "country": "ukraine",
    "region": "kyiv oblast",
    "settlement": "brovary"
  },
  "about": "I provide attentive and reliable childcare.",
  "characters": ["attentive", "patient", "creative"]
}
```

The server recalculates `isProfileComplete` after each update.

## Appointments

### Create Appointment

```http
POST /nannies/:nannyId/appointments
```

Authentication required. Role: `parent`.

Body:

```json
{
  "parentName": "Oleksandr Sulyma",
  "email": "parent@example.com",
  "address": "Kyiv, Khreshchatyk Street 12",
  "phone": "+380671234567",
  "childAge": "5 years",
  "scheduledAt": "2026-06-15T09:30:00.000Z",
  "comment": "We would like to arrange a meeting."
}
```

`scheduledAt` must be a future date.

### Get Parent Appointments

```http
GET /appointments/my
```

Authentication required. Role: `parent`.

### Get Incoming Nanny Appointments

```http
GET /appointments/incoming
```

Authentication required. Role: `nanny`.

### Accept or Reject Appointment

```http
PATCH /appointments/:appointmentId/status
```

Authentication required. Role: `nanny`.

Body:

```json
{
  "status": "accepted"
}
```

Allowed values: `accepted`, `rejected`.

### Complete Appointment

```http
PATCH /appointments/:appointmentId/complete
```

Authentication required. Role: `parent`.

Only accepted appointments can be completed.

### Cancel Appointment

```http
PATCH /appointments/:appointmentId/cancel
```

Authentication required. Role: `parent`.

Only pending or accepted appointments can be cancelled.

### Create Review

```http
POST /appointments/:appointmentId/reviews
```

Authentication required. Role: `parent`.

Body:

```json
{
  "rating": 5,
  "comment": "The nanny was attentive, punctual, and kind."
}
```

A review can be created only once and only for a completed appointment. The
nanny rating is recalculated automatically.
