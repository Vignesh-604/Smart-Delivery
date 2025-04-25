# Smart Delivery Management System

A web-based admin platform for managing delivery partners, orders, and assignments with smart allocation capabilities.
Built with TypeScript, React, Express, Node, and MongoDB in just four days. Despite my limited TypeScript experience, this project became a valuable learning opportunity. While there's room for improvement, I'm satisfied of what I accomplished within the time constraints.

---

> [!NOTE]
> The server may need about 50 seconds to initialize on first connection as it's hosted on Render's free tier.

## Tech Stack

### Backend 
- Node.js with Express
- MongoDB + Mongoose
- TypeScript
- RESTful API architecture
- Tested with Postman

### Frontend 
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Axios for HTTP requests
- React Router DOM

---

## Features

### Partner Management
- ✅ Partner registration & profile management
- ✅ Comprehensive partner listing
- ✅ Edit and delete functionality
- ❌ Finding eligible partners (backend ready but not implemented)

### Order Processing
- ✅ Orders dashboard with filtering options
- ✅ Order creation with automatic timestamps
- ✅ Order status tracking system
- ❌ Manual assignment (backend ready but not implemented)
- ✅ Complete assignment history
- ✅ Partner performance metrics

### Assignment System
- ✅ Smart auto-assignment algorithm
- ✅ Detailed assignment metrics
- ✅ Historical assignment logging
- ✅ Analytics dashboard

---

## Backend API Overview

### Partner Routes (`/api/partners`)
| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| POST   | `/`                 | Register new delivery partner  |
| GET    | `/`                 | List all partners              |
| GET    | `/:partnerId`       | Get partner details            |
| PUT    | `/:partnerId`       | Update partner information     |
| DELETE | `/:partnerId`       | Remove partner                 |
| GET    | `/eligible`         | Find available partners by area/time |

### Order Routes (`/api/orders`)
| Method | Endpoint            | Description                       |
|--------|---------------------|-----------------------------------|
| POST   | `/`                 | Create new order                  |
| GET    | `/`                 | List all orders (supports filters) |
| GET    | `/:orderId`         | Get specific order details        |
| PUT    | `/:orderId/status`  | Update order status               |
| POST   | `/assign`           | Manual order assignment           |

### Assignment Routes (`/api/assignments`)
| Method | Endpoint            | Description                       |
|--------|---------------------|-----------------------------------|
| POST   | `/run`              | Execute smart assignment          |
| GET    | `/metrics`          | View performance statistics       |
| GET    | `/history`          | Access full assignment history    |
| GET    | `/dashboard`        | Retrieve dashboard analytics      |

---

## Smart Assignment Logic

The system automatically allocates orders to partners based on:
- Orders with "pending" status
- Available partners (active status with current load < 3)
- Shift compatibility (including overnight shift support)
- Area matching (with string normalization for consistency)
- Load balancing (prioritizing partners with lower current loads)

Performance metrics include:
- Success rate calculation (successful assignments / total attempts × 100%)
- Failure reason tracking (no eligible partners, outside shift hours, etc.)

---

## Frontend Structure

### Dashboard (/)
- Key metrics overview
- Smart assignment trigger
- Active order monitoring
- Recent assignment activity
- Quick action shortcuts

### Partners Section
- Partner registration interface
- Comprehensive partner directory
- Detailed profile management

### Orders Management
- Filterable order listing
- Order detail view
- Status management options

### Assignments Tracking
- Performance metrics visualization
- Complete assignment history
- Statistical breakdown

---

## Frontend Routing

```typescript
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

## Key Features

- Status-based order filtering
- Timestamp-based recent order filtering
- Order status management
- Partner eligibility checking
- Backend supports "recent=true" parameter (returns orders up to 2 days old)

---

## Deployment Information
- Backend: Deployed on Render
- Frontend: Deployed on Vercel

---

## API Documentation

**Base URL:** `https://smart-delivery-api.onrender.com/api`
*(For local development: http://localhost:5000/api)*

### Assignment Endpoints

**POST /assignments/run**  
Triggers the smart assignment algorithm for pending orders.

**GET /assignments/metrics**  
Returns assignment performance statistics.

**GET /assignments/history**  
Provides complete assignment history with related details.

**GET /assignments/dashboard**  
Supplies dashboard analytics and metrics.

### Partner Endpoints

**POST /partners**  
Creates a new delivery partner.

Example request:
```json
{
  "name": "Tom Wilson",
  "email": "tom@example.com",
  "phone": "9876543210",
  "areas": ["Zone1", "Zone2"],
  "shift" :{
    "start": "10:00",
    "end": "20:00"
  }
}
```

**GET /partners**  
Retrieves all registered partners.

**GET /partners/:partnerId**  
Fetches specific partner information.

**PUT /partners/:partnerId**  
Updates partner details.

**DELETE /partners/:partnerId**  
Removes a partner from the system.

**GET /partners/eligible?area=Zone1**  
Finds available partners for a specific area (planned feature).

### Order Endpoints

**POST /orders**  
Creates a new delivery order.

Example request:
```json
{
  "name": "John Smith",
  "phone": "9876543210",
  "address": "456 Main Street",
  "area": "Zone 1",
  "items": [
    { "name": "Apple", "quantity": 3, "price": 30 }
  ]
}
```

**GET /orders**  
Lists all orders with optional filters:
- `status=pending`
- `recent=true`

**GET /orders/:id**  
Retrieves detailed order information.

**PUT /orders/:orderId/status**  
Updates order status.

Example request:
```json
{ "status": "delivered" }
```

**POST /orders/assign**  
Manually assigns an order to a specific partner (planned feature).

Example request:
```json
{
  "orderId": "60d21b4667d0d8992e610c85",
  "partnerId": "60d21b4667d0d8992e610c86"
}
```