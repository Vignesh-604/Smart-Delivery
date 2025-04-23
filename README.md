# Smart Delivery Management System

A web-based admin system to manage delivery partners, orders, and assignments using smart/manual allocation logic.
Implemented using Typescript, React, Express, Node and MongoDb for database under the course of 4 days. Even though I had litte experience in Typescript, this project, along with the help of AI tools, has been a learning experience for me. I do believe it can be imrpoved on much further but due to the time constaints I was only able to build so much.  
---

## Tech Stack

### Backend 
- Node.js + Express
- MongoDB with Mongoose
- TypeScript
- Postman (for testing)
- REST APIs

### Frontend 
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui for UI components
- Axios (for HTTP)
- React Router DOM

---

## Features Breakdown (from PDF)

### 1. Partner Management
- [x] Partner registration form
- [x] Partner list view
- [x] Partner profile editing
- [x] Partner deleting
- [x] Finding elgigble partners (not implemented)

### 2. Order Processing
- [x] Orders dashboard with filters
- [x] Order creation + auto time
- [x] Order status tracking
- [x] Manual assignment (not implemented)
- [x] Assignment history
- [x] Partner performance metrics

### 3. Assignment System
- [x] Smart (auto) assignment system 
- [x] Assignment metrics endpoint
- [x] Assignment history
- [x] Dashboard

---

## Backend API Overview

### Routes

#### `/api/partners`
| Method | Route                | Description                    |
|--------|----------------------|--------------------------------|
| POST   | `/r`                 | Register new delivery partner  |
| GET    | `/`                  | Get all partners               |
| GET    | `/:partnerId`        | Get single partner             |
| PUT    | `/:partnerId`        | Update partner                 |
| DELETE | `/:partnerId`        | Delete partner                 |
| GET    | `/eligible`          | Get eligible partners for area/time |

#### `/api/orders`
| Method | Route                | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | `/`                  | Create order                      |
| GET    | `/`                  | Get all orders + filters          |
| GET    | `/:orderId`          | Get single order                  |
| PUT    | `/status/:orderId`   | Toggle order status (picked/delivered) |
| POST   | `/assign`            | Manually assign order             |

#### `/api/assignments`
| Method | Route                | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | `/run`               | Trigger smart assignment          |
| GET    | `/metrics`           | Assignment performance metrics    |
| GET    | `/history`           | Full assignment history log       |
| GET    | `/dashboard`         | Show dashboard metrics            |

---

## Backend Logic

### Smart Assignment
- Orders with `status: "pending"`
- Active partners (`status: "active"`, `currentLoad < 3`)
- Shift comparison supports **overnight**
- Area matched by normalizing strings (`Zone 1` vs `Zone1`)
- Load-balanced by choosing partner with least `currentLoad`

###  Metrics Generation
- `successRate = (success / total) * 100`
- Breakdown of failure reasons (`no eligible`, `out of shift`, etc.)

---

## Frontend Pages

### `/dashboard`
- Metrics cards (partners, orders, success rate)
- Smart assignment trigger
- Active orders section
- Recent assignments
- Quick actions

### `/partners`
- Register Partner form
- Partner List (with edit/delete)
- View by area

### `/orders`
- All orders with filters (status, area, recent)
- Order details modal
- Manual assign modal

### `/assignments`
- Assignment metrics
- Assignment history list

---

## Frontend Routing

```ts
// main.tsx
<Route path="/" element={<App />} >
    <Route index element={<Dashboard />} />
    <Route path="/partners/details/:id" element={<PartnerDetails />} />
    <Route path="/partners" element={<PartnerList />} />
    <Route path="/partners/new" element={<PartnerForm />} />
    <Route path="/orders" element={<OrderList />} />
    <Route path="/orders/:id" element={<OrderDetails />} />
    <Route path="/assignments" element={<History />} />

    <Route path="*" element={<Dashboard />} />
</Route>
```

---

## Filtering & Sorting Features

- Filter orders by status or recent
- Assign manually via popup modal (not implemented)
- Toggle statuses (picked/delivered)
- Fetch eligible partners for area at current time
- Backend supports `"recent=true"` filter to get recent orders upto 2 days

---

## Sample Partner (Overnight)

```json
{
  "name": "Sonia Patel",
  "email": "sonia@example.com",
  "phone": "9876543210",
  "areas": ["Zone1", "Zone3"],
  "shift": {
    "start": "22:00",
    "end": "06:00"
  }
}
```

---

## Deployment Notes
- Use `.env` for Mongo URI and VITE_PROXY
- Frontend uses proxy for `/api` calls
- Smart assignment can be scheduled via cron or triggered manually

---

## Final Checklist

- [x] All API routes work and tested with Postman
- [x] Smart assignment handles overnight shifts
- [x] Partner area mismatch fixed
- [x] Full admin panel pages built
- [x] Assignment logging implemented
- [x] Metrics + history UI done

---

Let me know if you'd like:
- A PDF export of this
- Swagger/OpenAPI docs
- Cron job setup guide
- Presentation deck (for evaluation)

You're all set 💪
