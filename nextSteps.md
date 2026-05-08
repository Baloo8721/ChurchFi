# ChurchWIFI Project - Production Architecture Modernization

## Project Overview

**Purpose:** A unified WiFi access portal for multi-tenant residential/commercial properties (church property with residential units, commercial spaces, and guest facilities).

**Current Features:**
- Resident Portal (WiFi access, paid plans, maintenance, community board)
- Guest Portal (free sessions, donations, church events)
- Admin Dashboard (sessions, vouchers, events, posts, maintenance, property map)
- Property Map with camera status overlay

**Goal:** Convert from monolithic React/Firebase prototype to clean production-ready architecture using FastAPI + Supabase, while maintaining all existing functionality.

---

## Current System Review

### Tech Stack (Current)
| Component | Technology |
|-----------|------------|
| Frontend | React 19 + Vite 8 |
| Database | Firebase Realtime Database |
| Styling | CSS-in-JS (inline styles) |
| Hosting | GitHub Pages |

### Project Structure (Current)
```
src/
├── App.jsx          (~1200 lines - monolithic)
├── PropertyMap.jsx  (SVG property map)
├── firebase.js      (Firebase integration)
└── main.jsx         (Entry point)
```

### What's Working ✅
- Resident portal with timer-based WiFi access
- Guest portal with donation flow
- Admin dashboard with full CRUD
- Property map with camera overlays
- Firebase data persistence
- Responsive mobile design

### Problems to Fix 🚧
1. **Monolithic Code** - App.jsx is too large, needs modularization
2. **Security** - Hardcoded PIN (1234), no proper authentication
3. **Direct Infrastructure Access** - Frontend directly accesses camera data
4. **No Error Handling** - Missing error boundaries, global loading states
5. **Limited Adaptability** - Hardcoded for single property

---

## New Architecture Design

### Architecture Rules (MUST FOLLOW)
1. **Frontend NEVER directly talks to cameras, routers, or WiFi systems**
2. **Backend acts as secure middleware/API adapter**
3. **Frontend becomes API-driven only**
4. **Existing network/camera infrastructure remains untouched**
5. **Keep MVP simple - avoid overengineering**

### Target Stack
| Component | Technology | Purpose |
|------------|------------|---------|
| Frontend | React + Vite | UI/UX |
| Backend | FastAPI | API middleware/adapter |
| Database/Auth | Supabase | PostgreSQL + Auth |
| Backend Hosting | Render | API server |
| Frontend Hosting | Vercel | Static app |

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│   │ Resident│  │  Guest  │  │  Admin  │  │ Property│      │
│   │ Portal  │  │ Portal  │  │Dashboard│  │  Map    │      │
│   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘      │
│        │            │            │            │            │
│        └────────────┴────────────┴────────────┘            │
│                         │                                   │
│                    API Service Layer                        │
│                  (src/services/api.js)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────┴───────────────────────────────────┐
│                    BACKEND (Render)                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                   FastAPI Server                      │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│   │  │  /auth  │ │/sessions│ │/cameras │ │/events  │    │   │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐                │   │
│   │  │ /maint  │ │/vouchers│ │ /posts  │                │   │
│   │  └─────────┘ └─────────┘ └─────────┘                │   │
│   └──────────────────────┬────────────────────────────────┘   │
│                          │                                    │
│         ┌────────────────┼────────────────┐                    │
│         │                │                │                    │
│   ┌─────┴─────┐   ┌──────┴──────┐   ┌─────┴─────┐          │
│   │ Supabase  │   │  External  │   │   WiFi    │          │
│   │  (DB+Auth)│   │  Camera API│   │  Router   │          │
│   └───────────┘   └────────────┘   └───────────┘          │
│                  (via adapters)                             │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementation Tasks

### Phase 1: Frontend Modularization (Week 1)

#### 1.1 New Project Structure
```
src/
├── main.jsx                 # Entry point (keep)
├── App.jsx                  # Routes + layout (simplify)
├── components/
│   ├── portals/
│   │   ├── ResidentPortal.jsx
│   │   ├── GuestPortal.jsx
│   │   └── index.js
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── SessionsTab.jsx
│   │   ├── VouchersTab.jsx
│   │   ├── EventsTab.jsx
│   │   ├── BoardTab.jsx
│   │   ├── MaintenanceTab.jsx
│   │   ├── PropertyMapTab.jsx
│   │   └── index.js
│   ├── common/
│   │   ├── Loading.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Toast.jsx
│   │   ├── Navbar.jsx
│   │   └── index.js
│   └── forms/
│       ├── EventForm.jsx
│       ├── PostForm.jsx
│       ├── MaintenanceForm.jsx
│       └── index.js
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   ├── useSessions.js
│   └── index.js
├── services/
│   ├── api.js              # NEW: API service layer
│   ├── auth.js
│   ├── sessions.js
│   ├── cameras.js
│   ├── events.js
│   ├── maintenance.js
│   ├── vouchers.js
│   ├── posts.js
│   └── index.js
├── pages/
│   ├── Login.jsx
│   ├── Resident.jsx
│   ├── Guest.jsx
│   └── Admin.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── ApiContext.jsx
│   └── index.js
├── config/
│   ├── constants.js
│   └── index.js
└── styles/
    └── global.css
```

#### 1.2 Break Down App.jsx
- Extract each portal into `src/components/portals/`
- Extract admin tabs into `src/components/admin/`
- Create shared components in `src/components/common/`
- Move API calls to service layer

#### 1.3 Add API Service Layer
```javascript
// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

export const api = {
  // Auth
  login: (credentials) => fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
  
  // Sessions
  getSessions: () => fetchAPI('/api/sessions'),
  createSession: (data) => fetchAPI('/api/sessions', { method: 'POST', body: JSON.stringify(data) }),
  updateSession: (id, data) => fetchAPI(`/api/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSession: (id) => fetchAPI(`/api/sessions/${id}`, { method: 'DELETE' }),
  
  // ... etc
};
```

---

### Phase 2: Backend Setup (Week 1-2)

#### 2.1 Create FastAPI Project
```
backend/
├── main.py                 # FastAPI app entry
├── requirements.txt         # Dependencies
├── .env.example            # Env vars template
├── app/
│   ├── __init__.py
│   ├── main.py            # App factory
│   ├── config.py          # Settings
│   ├── models.py          # Pydantic models
│   ├── database.py        # Supabase connection
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   └── dependencies.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── sessions.py
│   │   ├── cameras.py
│   │   ├── events.py
│   │   ├── maintenance.py
│   │   ├── vouchers.py
│   │   └── posts.py
│   └── adapters/
│       ├── __init__.py
│       ├── camera_adapter.py
│       └── wifi_adapter.py
└── tests/
    └── test_routes.py
```

#### 2.2 Create API Routes

**`/api/auth`** - Authentication
- `POST /auth/login` - Admin login (Supabase Auth)
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

**`/api/sessions`** - WiFi Sessions
- `GET /sessions` - List all sessions
- `POST /sessions` - Create new session
- `PUT /sessions/{id}` - Update session
- `DELETE /sessions/{id}` - Terminate session

**`/api/cameras`** - Camera Status (READ-ONLY, adapter pattern)
- `GET /cameras` - List cameras with status
- `GET /cameras/{id}` - Get specific camera
- `GET /cameras/{id}/stream` - Get stream URL (not actual stream)

**`/api/events`** - Church Events
- `GET /events` - List events
- `POST /events` - Create event
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event

**`/api/maintenance`** - Maintenance Requests
- `GET /maintenance` - List requests
- `POST /maintenance` - Create request
- `PUT /maintenance/{id}` - Update status
- `DELETE /maintenance/{id}` - Delete request

**`/api/vouchers`** - Voucher Codes
- `GET /vouchers` - List vouchers
- `POST /vouchers` - Generate vouchers
- `PUT /vouchers/{id}` - Mark as used

**`/api/posts`** - Community Board Posts
- `GET /posts` - List posts
- `POST /posts` - Create post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post

---

### Phase 3: Supabase Integration (Week 2)

#### 3.1 Database Schema (Supabase)

```sql
-- profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'resident', 'guest')),
  unit TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('resident', 'guest')),
  unit TEXT,
  name TEXT,
  mac TEXT,
  ip TEXT,
  status TEXT CHECK (status IN ('active', 'paid', 'expired')),
  paid BOOLEAN DEFAULT FALSE,
  plan TEXT,
  minutes_used INTEGER DEFAULT 0,
  paid_hours_total INTEGER,
  paid_hours_used INTEGER,
  data_used TEXT,
  last_seen TEXT,
  guest_event TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT,
  time TEXT,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- maintenance
CREATE TABLE maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit TEXT NOT NULL,
  category TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,
  title TEXT,
  body TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- vouchers
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- cameras
CREATE TABLE cameras (
  id TEXT PRIMARY KEY,
  label TEXT,
  zone TEXT,
  x INTEGER,
  y INTEGER,
  status TEXT,
  external_id TEXT
);
```

#### 3.2 Environment Variables

```env
# Frontend (.env)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000

# Backend (.env)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

#### 3.3 Migrate from Firebase
- Keep Firebase as fallback during transition
- Gradually move data to Supabase
- Remove Firebase code after verified

---

### Phase 4: Global Error/Loading Handling (Week 2)

#### 4.1 Error Boundary
```jsx
// src/components/common/ErrorBoundary.jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <div className="error-page">Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

#### 4.2 Loading States
- Create global loading context
- Add loading spinner to API calls
- Show skeleton loaders for data

---

### Phase 5: Deployment Prep (Week 3)

#### 5.1 Vercel Frontend
1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy on push to main

#### 5.2 Render Backend
1. Create Render account
2. Connect GitHub repo
3. Set environment variables
4. Deploy as web service

#### 5.3 CORS Configuration
- Allow Vercel domain in FastAPI CORS
- Configure allowed origins

---

## What NOT to Build

- ❌ **NVR logic** - Don't process video streams
- ❌ **RTSP stream handling** - Leave to existing infrastructure
- ❌ **Networking infrastructure** - Don't build router/firewall logic
- ❌ **Kubernetes/microservices** - Keep it simple with monolith FastAPI
- ❌ **AI/ML systems** - Not in MVP scope

---

## Implementation Order

1. **Create FastAPI backend scaffold** → minimal working API
2. **Add Supabase database + schema**
3. **Build API routes one by one**
4. **Create frontend API service layer**
5. **Refactor App.jsx into components**
6. **Add error boundaries + loading states**
7. **Test API integration end-to-end**
8. **Deploy to Render + Vercel**
9. **Switch from Firebase to Supabase**

---

## Summary

| Aspect | Current | Target |
|--------|---------|--------|
| Code Structure | Monolithic App.jsx | Modular components |
| Backend | None (Firebase direct) | FastAPI middleware |
| Database | Firebase RTDB | Supabase PostgreSQL |
| Auth | Hardcoded PIN | Supabase Auth |
| Security | Frontend-only | API-first with auth |
| Deployment | GitHub Pages | Vercel + Render |

**Key Benefits:**
- **Security**: Backend acts as gatekeeper, no direct infrastructure access
- **Adaptability**: Plugin adapters for different camera/WiFi systems
- **Maintainability**: Clean separation of concerns
- **Scalability**: Can add more properties easily via config

---

*Document Status: Architecture Planning Phase*
*Target: Production-Ready MVP*
*Stack: React + Vite | FastAPI | Supabase | Render + Vercel*