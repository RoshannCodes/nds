# StaffAttend

A full-stack internal organizational system for managing staff members and tracking attendance with role-based access control.

## 📋 Overview

StaffAttend is a modern web application that helps organizations manage their staff and track attendance efficiently. It features a secure authentication system with role-based permissions, allowing administrators to manage staff accounts and view all attendance records, while staff members can check in/out and view their own attendance history.

## 🏗️ Architecture

This is a **monorepo** containing both the backend server and frontend client:

- **Backend (Server)**: RESTful API built with Node.js, Express, PostgreSQL, and Drizzle ORM
- **Frontend (Client)**: Modern web interface built with Next.js 16, TypeScript, and Tailwind CSS

## ✨ Key Features

### For Administrators
- ✅ Manage staff accounts (create, update, delete)
- ✅ View all attendance records with filtering
- ✅ Access system-wide statistics
- ✅ Role assignment (Admin/Staff)

### For Staff Members
- ✅ Quick check-in/check-out functionality
- ✅ View personal attendance history
- ✅ Track personal statistics
- ✅ Filter personal records

### System Features
- 🔒 JWT-based authentication
- 🎭 Role-based access control (RBAC)
- 📊 Real-time attendance tracking
- 📅 Date-based filtering and reporting
- 🎨 Professional, responsive UI

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form
- **Validation**: Zod
- **Icons**: lucide-react

## 📁 Project Structure

```
fsa-nds/
├── server/                     # Backend API
│   ├── src/
│   │   ├── db/                 # Database configuration & schemas
│   │   │   ├── schema/         # Drizzle schemas
│   │   │   ├── migrations/     # Database migrations
│   │   │   ├── index.ts
│   │   │   └── migrate.ts
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication
│   │   │   ├── staff/          # Staff management
│   │   │   └── attendance/     # Attendance tracking
│   │   ├── routes/             # API routes
│   │   ├── scripts/            # Utility scripts
│   │   │   └── seed.ts         # Database seeding
│   │   ├── utils/              # Helper utilities
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
│
├── client/                     # Frontend application
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── dashboard/      # Dashboard
│   │   │   ├── staff/          # Staff management
│   │   │   ├── attendance/     # Attendance records
│   │   │   └── login/          # Login page
│   │   ├── components/         # React components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # UI components
│   │   ├── contexts/           # React contexts
│   │   ├── lib/                # Utilities & API client
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** 14.x or higher

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fsa-nds
```

### 2. Backend Setup

#### 2.1. Install Dependencies

```bash
cd server
npm install
```

#### 2.2. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb fsa_nds

# Or using SQL
psql -U postgres
CREATE DATABASE fsa_nds;
```

#### 2.3. Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fsa_nds

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**Important**: Replace `username`, `password`, and `JWT_SECRET` with your actual values.

#### 2.4. Run Migrations

```bash
npm run migrate
```

#### 2.5. Seed the Database (Optional)

Create initial admin account and sample data:

```bash
npm run seed
```

This creates:
- Admin account: `admin@example.com` / `admin123`
- Sample staff accounts with test data

#### 2.6. Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

The server will start at `http://localhost:5000`

### 3. Frontend Setup

#### 3.1. Install Dependencies

```bash
cd ../client
npm install
```

#### 3.2. Environment Variables

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### 3.3. Start the Frontend Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will start at `http://localhost:3000`

### 4. Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Log in with the seeded credentials:
   - **Admin**: `admin@example.com` / `admin123`
   - **Staff**: `john.doe@example.com` / `password123`

## 🔧 Available Scripts

### Backend (server/)

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database with initial data
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

### Frontend (client/)

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Staff Management (Admin Only)
- `GET /api/staff` - List all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff
- `GET /api/staff/statistics` - Get staff statistics

### Attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance` - List attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `POST /api/attendance` - Create attendance (Admin)
- `PUT /api/attendance/:id` - Update attendance (Admin)
- `DELETE /api/attendance/:id` - Delete attendance (Admin)
- `GET /api/attendance/statistics` - Get attendance statistics

For detailed API documentation, see [API.md](API.md)

## 🔒 Security

- **Authentication**: JWT tokens with configurable expiration
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configured for specific origins
- **Input Validation**: Zod schemas on both frontend and backend
- **Role-Based Access**: Protected routes and endpoints
- **SQL Injection Prevention**: Drizzle ORM with parameterized queries

## 🗄️ Database Schema

### Staff Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- firstName (String)
- lastName (String)
- role (Enum: 'ADMIN' | 'STAFF')
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Attendance Table
```sql
- id (UUID, Primary Key)
- staffId (UUID, Foreign Key → staff.id)
- date (Date, YYYY-MM-DD)
- checkInTime (Time, HH:MM:SS)
- checkOutTime (Time, HH:MM:SS)
- status (Enum: 'PRESENT' | 'LATE' | 'ABSENT')
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U username -d fsa_nds

# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS
```

### Port Already in Use

```bash
# Find and kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Missing Dependencies

```bash
# Clean install for backend
cd server
rm -rf node_modules package-lock.json
npm install

# Clean install for frontend
cd client
rm -rf node_modules package-lock.json .next
npm install
```

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment | development | No |
| `DATABASE_URL` | PostgreSQL connection string | - | **Yes** |
| `JWT_SECRET` | Secret key for JWT signing | - | **Yes** |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h | No |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 | No |

### Frontend (.env.local)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | - | **Yes** |

## 🚢 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Build the application: `npm run build`
3. Run migrations: `npm run migrate`
4. Start the server: `npm start`

### Frontend Deployment

1. Set `NEXT_PUBLIC_API_URL` to your production API URL
2. Build the application: `npm run build`
3. Start the server: `npm start`

**Recommended Platforms**:
- Backend: Railway, Render, DigitalOcean, AWS
- Frontend: Vercel, Netlify, Cloudflare Pages
- Database: Supabase, Railway, Neon, AWS RDS

## 📄 License

ISC

## 👥 Support

For issues, questions, or contributions, please contact your system administrator.

---

**Note**: This is an internal organizational system. Ensure all security best practices are followed in production environments, including using strong JWT secrets, HTTPS connections, and regular security updates.
