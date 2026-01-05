# Quotation-Based E-Commerce System

This system implements a quotation-based e-commerce platform where customers can browse products and request quotations instead of making direct purchases. Admins can manage quotation requests through a dedicated admin panel.

## Features Implemented

### Customer Side
- ✅ Customer login and registration
- ✅ Browse products **without seeing prices**
- ✅ "Add to Quotation Cart" functionality (replaces traditional cart)
- ✅ Submit quotation requests with selected items
- ✅ No checkout or payment functionality

### Admin Side
- ✅ Admin login (no registration available in UI)
- ✅ Admin dashboard with quotation statistics
- ✅ View all quotation requests
- ✅ Manage quotation status (pending → reviewed → quoted/rejected)
- ✅ Filter quotations by status
- ✅ Search quotations by customer

### Security & Access Control
- ✅ Role-based authentication (customer vs admin)
- ✅ Admin registration disabled in UI (admins must be pre-created in database)
- ✅ Protected admin routes
- ✅ JWT-based authentication
- ✅ Prices hidden from customers

## Technology Stack

### Frontend (Next.js)
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

### Backend (Node.js)
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS enabled

## Setup Instructions

### 1. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file with the following:
# MONGO_URL=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key

# Start the server (runs on port 4900)
npm start
```

### 2. Frontend Setup

```bash
cd frontend-next

# Install dependencies
npm install

# Create .env.local file:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:4900

# Start the development server
npm run dev
```

### 3. Database Setup

#### Create Admin User

Since admin registration is disabled in the UI, you need to create admin users directly in MongoDB:

```javascript
// Using MongoDB shell or Compass
db.users.insertOne({
  email: "admin@titec.com",
  firstName: "Admin",
  lastName: "User",
  password: "$2b$10$...", // Hash the password using bcrypt
  role: "admin",
  isBlocked: false,
  isEmailVerified: true,
  image: "/default.jpg"
})
```

Or use the backend API endpoint (if you temporarily enable it):

```bash
POST http://localhost:4900/api/users/register
{
  "email": "admin@titec.com",
  "firstName": "Admin",
  "lastName": "User",
  "password": "your_password",
  "role": "admin"
}
```

**Important:** After creating admin accounts, ensure the registration endpoint validates that `role` cannot be set to "admin" from the frontend.

## User Flows

### Customer Flow

1. **Registration**: Customer registers at `/register`
2. **Login**: Login at `/login` (select "Customer" role)
3. **Browse Products**: Navigate to `/store` to view products (prices hidden)
4. **Add to Quotation**: Click "Add to Quotation" on products
5. **View Cart**: Click cart icon in header to review quotation cart
6. **Submit Request**: Click "Request Quotation" to submit

### Admin Flow

1. **Login**: Login at `/login` (select "Admin" role)
2. **Dashboard**: View quotation statistics at `/admin`
3. **Manage Quotations**: Navigate to `/admin/quotations`
4. **Update Status**: Mark requests as reviewed, quoted, or rejected
5. **Filter/Search**: Use filters to find specific quotations

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new customer
- `POST /api/users/login` - Login (customer or admin)

### Quotations
- `POST /api/quotations` - Create quotation request
- `GET /api/quotations` - Get all quotations (admin only)
- `GET /api/quotations/my-quotations` - Get customer's quotations
- `GET /api/quotations/:id` - Get single quotation
- `PATCH /api/quotations/:id` - Update quotation status (admin only)
- `DELETE /api/quotations/:id` - Delete quotation (admin only)

## Data Models

### User
```javascript
{
  email: String,
  firstName: String,
  lastName: String,
  password: String (hashed),
  role: "customer" | "admin",
  isBlocked: Boolean,
  isEmailVerified: Boolean,
  image: String
}
```

### Quotation
```javascript
{
  customerId: ObjectId (ref: User),
  customerName: String,
  customerEmail: String,
  items: [{
    id: String,
    name: String,
    quantity: Number,
    category: String,
    description: String
  }],
  status: "pending" | "reviewed" | "quoted" | "rejected",
  notes: String,
  submittedAt: Date
}
```

## Key Implementation Details

1. **Price Hiding**: Product prices are stored in the frontend but only displayed to admin users. The `isAdmin` check in the store page conditionally renders prices.

2. **Cart vs Quotation**: The CartContext was renamed conceptually to handle "quotation cart" with localStorage key `quotationCart` instead of `cart`.

3. **Admin Protection**: Admin routes check `useAuth().isAdmin` and redirect to login if unauthorized.

4. **Role Validation**: Login validates that the user's role in the database matches the selected role at login.

5. **Quotation Submission**: Can work with or without authentication. Authenticated users have their info auto-filled.

## Testing

### Test Customer Account
```
Email: customer@test.com
Password: password123
Role: Customer
```

### Test Admin Account (create manually)
```
Email: admin@titec.com
Password: admin123
Role: Admin
```

## Future Enhancements

- Email notifications when quotations are updated
- File upload for product specifications
- Bulk quotation management
- Export quotations to PDF
- Customer quotation history page
- Real-time quotation status updates
- Admin notes/comments on quotations
- Price quoting interface for admins

## Notes

- All prices are hidden from customers throughout the application
- Only admins can see product prices in the store
- Registration is only available for customers
- Admin accounts must be pre-created in the database
- Quotation cart persists in localStorage
- JWT tokens are stored in localStorage for authentication

## Support

For issues or questions, please contact the development team.
