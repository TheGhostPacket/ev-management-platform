# EV Management Platform for Africa

Production-ready Electric Vehicle Management Platform with focus on Ghana/Africa deployment.

## 🏗️ Architecture

- **Frontend**: Next.js 15 + React + Tailwind CSS + Mapbox
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: JWT with HTTP-only cookies
- **Database**: PostgreSQL with migrations
- **Deployment**: Vercel (Frontend) + Render/Railway (Backend)

## 📁 Project Structure

```
ev-management-platform/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, rate limiting, validation
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   └── migrations/         # Database migrations
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js 15 app router
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities & API client
└── docs/                  # Technical documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL
npm run dev
```

## 🗄️ Database Schema

- **ev_manufacturers**: EV brand data
- **ev_models**: Vehicle specifications
- **ev_charging_stations**: Charging infrastructure
- **ev_case_studies**: Implementation case studies
- **users**: Admin/editor accounts
- **newsletter_subscribers**: Newsletter management

## 🔐 Security Features

- JWT authentication with HTTP-only cookies
- Role-based access control (Admin, Editor, Viewer)
- Rate limiting (100 req/15min global, stricter for auth endpoints)
- Input validation & sanitization
- SQL injection protection via parameterized queries
- XSS protection
- CSRF tokens
- Helmet.js security headers

## 📊 Key Features

### Public Website
- EV database with advanced filtering
- Interactive charging station map
- Case studies repository
- Carbon footprint calculator
- EV vs Fuel cost comparison
- Newsletter subscription

### Admin Portal
- Secure authentication
- CRUD operations for all data
- User & role management
- Newsletter subscriber management
- Content management system

## 🌍 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render/Railway)
- Set environment variables
- Connect PostgreSQL database
- Deploy from GitHub repository

See `docs/DEPLOYMENT.md` for detailed instructions.

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🧮 Calculator Formulas

### CO₂ Emissions
- Fuel: `Fuel_Consumed × 2.31 kg CO₂/L`
- EV: `Energy_Consumption × Distance × 0.17 kg CO₂/kWh` (Ghana grid)

### Cost Comparison
- Fuel: `Fuel_Consumed × Fuel_Price/L`
- EV: `Energy_Consumption × Distance × Cost/kWh`

## 📝 License

Proprietary - All rights reserved

## 👤 Author

Full-Stack Developer | EV Platform Architect
