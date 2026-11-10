# Adora Frontend

The official web frontend for the **Adora** rider-based outdoor advertising platform. Built with React 19, TypeScript, Vite, Tailwind CSS, and TanStack Query.

---

## Features

- **Rider Portal**:
  - Live daily earnings and active campaign dashboard.
  - **Start Day**: Odometer reading entry with initial odometer photo & vehicle ad photo proof.
  - **End Day**: Closing odometer reading entry with odometer photo & vehicle closing ad proof.
  - **History**: Full historical log of daily rides, kilometres logged, and payment statuses.
- **Admin Dashboard**:
  - Comprehensive operational metrics and pending payout totals.
  - Campaign queue management with approval and assignment workflows.
  - Rider onboarding, KYC verification, status controls, and audit trails.
  - Daily log review with photo evidence verification.
  - Payout generation and settlement tracking.
- **Visual Design**:
  - Emerald Prestige theme (`#064E3B`, `#10B981`, `#F5F0E8`, `#1F2937`).
  - Interactive top progress bar with driving scooty animation (`GlobalTopLoader`).
  - Custom vector scooty illustration loader for page & data states (`ScootyLoader`).

---

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State & Data Fetching**: TanStack React Query v5
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## Getting Started

### 1. Prerequisites
- Node.js 20+
- npm or pnpm

### 2. Environment Configuration
Create a `.env` file in the frontend root based on `.env.example`:
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173` (or the assigned Vite port).

### 5. Build for Production
```bash
npm run build
```
Build outputs are generated in the `dist/` directory.

---

## Project Structure

```
frontend/
├── public/               # Favicon and static assets
├── src/
│   ├── api/             # Axios client, interceptors, and error handling
│   ├── auth/            # AuthContext, token management, and auth hooks
│   ├── components/      # UI components (GlobalTopLoader, ScootyLoader, etc.)
│   ├── layouts/         # App shell and navigation bars
│   ├── pages/
│   │   ├── admin/       # Admin views (Overview, Ads, Riders, Logs, Payouts, Plans)
│   │   ├── auth/        # Login and registration views
│   │   └── rider/       # Rider views (Dashboard, Start, End, History)
│   ├── App.tsx          # Root router & query providers
│   ├── index.css        # Global Tailwind & animation styles
│   └── main.tsx         # Application entry point
├── Dockerfile           # Production container build
├── nginx.conf           # Reverse proxy & SPA fallback configuration
└── vite.config.ts       # Vite configuration
```

---

## License
Private & Proprietary - Adora Platform

