# Lanka Explorer — Admin Portal

Internal dashboard for Lanka Explorer administrators to manage destinations, listings, bookings, and users.  
**University of Kelaniya — SENG 41293**

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | v19 | UI framework |
| Vite | v8 | Build tool & dev server |
| React Router DOM | v7 | Client-side routing |
| Tailwind CSS | v4 | Utility-first styling |
| Axios | v1 | HTTP API requests |
| Lucide React | v1 | Icons |

---

## Features

- **Dashboard** — overview stats (bookings, listings, users, revenue)
- **Attractions** — create, edit, delete tourist destinations with image upload
- **Listings** — manage hotels, tours and vehicles with image upload & pricing
- **Bookings** — view all bookings, approve/reject payments, confirm or cancel
- **Users** — view all registered customers, enable/disable accounts
- Drag & drop **image upload** directly from the admin forms
- Admin-only access — non-admin accounts are rejected at login

---

## Project Structure

```
admin-portal/
├── src/
│   ├── main.jsx                        # App entry point
│   ├── App.jsx                         # Routes & layout
│   ├── index.css                       # Tailwind + brand theme
│   ├── api/
│   │   ├── client.js                   # Axios instance with admin JWT interceptor
│   │   └── index.js                    # All API call functions
│   ├── contexts/
│   │   └── AuthContext.jsx             # Admin login / logout / session
│   ├── hooks/
│   │   ├── useAttractions.js
│   │   ├── useListings.js
│   │   ├── useBookings.js
│   │   └── useUsers.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx         # Sidebar + top bar wrapper
│   │   │   └── Sidebar.jsx             # Navigation sidebar
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx               # Input, Select, Textarea
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx               # Booking status badge
│   │   │   ├── StatCard.jsx            # Dashboard stat card
│   │   │   ├── Table.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ImageUpload.jsx         # Drag & drop image uploader
│   │   ├── listings/
│   │   │   ├── ListingForm.jsx         # Hotel / tour / vehicle form
│   │   │   └── AttractionForm.jsx      # Destination form
│   │   ├── bookings/
│   │   │   ├── BookingActions.jsx      # Approve / reject / cancel buttons
│   │   │   ├── BookingStatusFilter.jsx
│   │   │   ├── BookingTimeline.jsx
│   │   │   └── PaymentDetails.jsx
│   │   └── users/
│   │       ├── UserDrawer.jsx
│   │       └── UserSearch.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AttractionsPage.jsx
│   │   ├── ListingsPage.jsx
│   │   ├── BookingsPage.jsx
│   │   ├── BookingDetailPage.jsx
│   │   └── UsersPage.jsx
│   └── utils/
│       ├── formatters.js               # Currency, date formatters
│       └── constants.js
├── index.html
├── vite.config.js
└── package.json
```

---

## Prerequisites

- Node.js v18 or higher — https://nodejs.org
- Lanka Explorer Backend running on http://localhost:5000
- An admin account in the database (created by the seed script)

---

## Setup & Installation

### 1. Install dependencies

```bash
cd admin-portal
npm install
```

### 2. Environment variable (optional)

By default the app connects to `http://localhost:5000/api`.  
If your backend runs on a different URL, create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the development server

```bash
npm run dev
```

App runs at: **http://localhost:5174**

### 4. Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## Connecting to the Backend

Make sure the backend API is running before starting the admin portal.  
Start order:

```
1. Start MongoDB (or ensure Atlas is accessible)
2. Run seed script (first time only)  →  node --env-file=.env src/seed.js
3. Start Backend   →  cd lanka-explorer-backend && npm run dev
4. Start Admin Portal  →  cd admin-portal && npm run dev
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Admin-only login form |
| `/` | Dashboard | Stats overview |
| `/attractions` | Attractions | Manage tourist destinations |
| `/listings` | Listings | Manage hotels, tours & vehicles |
| `/bookings` | Bookings | View and manage all bookings |
| `/bookings/:id` | Booking Detail | Full booking info + status actions |
| `/users` | Users | View and manage customer accounts |

---

## Admin Login

After running the seed script:

| Field | Value |
|---|---|
| Email | admin@lankaexplorer.lk |
| Password | admin123 |

> Only accounts with `role: "admin"` can log in to the admin portal. Regular customer accounts will be rejected.

---

## Booking Status Transitions

Admins can move bookings through the following states:

| From | Action | To |
|---|---|---|
| `under_review` | Confirm payment | `confirmed` |
| `under_review` | Reject payment | `payment_rejected` |
| `confirmed` | Mark complete | `completed` |
| Any active state | Cancel | `cancelled` |

Customers submit payment proof from their portal, which moves the booking to `under_review` for admin action.

---

## Image Upload

Admin forms support drag & drop or click-to-browse image upload:
- Images are uploaded immediately on selection to `POST /api/upload`
- Stored in `lanka-explorer-backend/uploads/` folder
- Max file size: **5 MB** per image
- Up to **6 images** per listing or attraction
- First image is automatically used as the cover photo
