# 🏥 Ayush Multi Speciality Hospital - Backend API

A robust, production-ready **NestJS** backend with **PostgreSQL 18** and **TypeORM** for managing patient enquiry forms and doctor appointment bookings for the Ayush Hospital web portal.

---

## 🚀 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js TypeScript framework)
- **Database**: [PostgreSQL 18](https://www.postgresql.org/) (via `pg` and `typeorm`)
- **ORM**: [TypeORM](https://typeorm.io/) with automatic entity schema synchronization
- **Validation**: `class-validator` & `class-transformer`
- **Documentation**: Swagger OpenAPI (`/api/docs`)
- **Security & CORS**: Configurable CORS enabled for the frontend portal (`http://localhost:5173`)

---

## 📁 Project Structure

```
ayushhospital-backend/
├── src/
│   ├── appointments/               # Appointments Module
│   │   ├── dto/
│   │   │   ├── create-appointment.dto.ts
│   │   │   └── update-appointment.dto.ts
│   │   ├── entities/
│   │   │   └── appointment.entity.ts
│   │   ├── appointments.controller.ts
│   │   ├── appointments.module.ts
│   │   └── appointments.service.ts
│   ├── enquiries/                  # Enquiries Module
│   │   ├── dto/
│   │   │   ├── create-enquiry.dto.ts
│   │   │   └── update-enquiry.dto.ts
│   │   ├── entities/
│   │   │   └── enquiry.entity.ts
│   │   ├── enquiries.controller.ts
│   │   ├── enquiries.module.ts
│   │   └── enquiries.service.ts
│   ├── app.module.ts               # Root module & PostgreSQL connection
│   └── main.ts                     # Application entry point & Swagger setup
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── nest-cli.json                   # Nest CLI config
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18 or higher, v24 recommended)
- PostgreSQL 18 (or 14+) installed and running locally or on a server

### 2. Create PostgreSQL Database
In your PostgreSQL terminal or pgAdmin:
```sql
CREATE DATABASE ayushhospital_db;
```

### 3. Configure Environment Variables
Edit the `.env` file in the root directory:
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=ayushhospital_db
DB_SYNC=true
DB_SSL=false
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Server

**Development mode (with auto-reload):**
```bash
npm run start:dev
```

**Production build & run:**
```bash
npm run build
npm run start:prod
```

Once started:
- 🔗 **API Base URL**: `http://localhost:4000/api`
- 📚 **Interactive Swagger Docs**: `http://localhost:4000/api/docs`

---

## 📡 API Reference

### 📨 1. Enquiries (`/api/enquiries`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/enquiries` | Submit a new patient enquiry |
| `GET` | `/api/enquiries` | List all enquiries (supports `?status=PENDING`) |
| `GET` | `/api/enquiries/:id` | Get enquiry by UUID |
| `PATCH` | `/api/enquiries/:id` | Update enquiry status (`PENDING`, `IN_REVIEW`, `RESOLVED`, `ARCHIVED`) |
| `DELETE` | `/api/enquiries/:id` | Delete an enquiry |

**Example POST Request Body:**
```json
{
  "name": "Ravi Kumar",
  "email": "ravi.kumar@example.com",
  "phone": "+91 98765 43210",
  "message": "I would like to know the availability of Dr. Kalaichelvam for consultation this Saturday."
}
```

---

### 📅 2. Appointments (`/api/appointments`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/appointments` | Book a doctor appointment |
| `GET` | `/api/appointments` | List appointments (supports `?status=`, `?doctor=`, `?date=`) |
| `GET` | `/api/appointments/:id` | Get appointment details by UUID |
| `PATCH` | `/api/appointments/:id` | Update appointment status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`) |
| `DELETE` | `/api/appointments/:id` | Cancel/remove an appointment record |

**Example POST Request Body:**
```json
{
  "patientName": "Sundar Raman",
  "email": "sundar.raman@example.com",
  "phone": "+91 98401 23456",
  "service": "Orthopaedic Surgery",
  "doctor": "Dr. C. Kalaichelvam",
  "preferredDate": "2026-10-15",
  "preferredTime": "10:00 AM",
  "reason": "Experiencing joint stiffness and knee discomfort."
}
```

---

## 🧪 Integration with Frontend

In your React frontend (`ayush-wellness-portal`), you can submit forms to this backend:

```typescript
// Book Appointment
const response = await fetch('http://localhost:4000/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientName: values.Patient,
    email: values.Email,
    phone: values.Phone,
    service: values.Service,
    doctor: values.Doctor,
    preferredDate: values.Date,
    preferredTime: values.Time,
    reason: values.Reason,
  }),
});

// Submit Enquiry
const response = await fetch('http://localhost:4000/api/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: values.Name,
    email: values.Email,
    phone: values.Phone,
    message: values.Message,
  }),
});
```
