# Quick Start Guide - Quotation System

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../frontend-next
npm install
```

### Step 2: Configure Environment

**Backend - Create `Backend/.env`:**
```env
MONGO_URL=mongodb://localhost:27017/titec-automation
JWT_SECRET=your_super_secret_key_change_this_in_production
```

**Frontend - Create `frontend-next/.env.local`:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4900
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:
```bash
# If using MongoDB locally
mongod

# Or use MongoDB Atlas cloud database
```

### Step 4: Create Admin User

```bash
cd Backend
node scripts/createAdmin.js
```

This creates:
- **Email**: admin@titec.com
- **Password**: admin123
- **Role**: admin

⚠️ **Change the password after first login!**

### Step 5: Start the Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
# Server runs on http://localhost:4900
```

**Terminal 2 - Frontend:**
```bash
cd frontend-next
npm run dev
# App runs on http://localhost:3000
```

## 🎯 Test the System

### Test as Customer

1. Go to http://localhost:3000
2. Click "Register" → Create a customer account
3. Login with your customer credentials
4. Browse the store (note: prices are hidden!)
5. Click "Add to Quotation" on products
6. View your quotation cart (cart icon in header)
7. Click "Request Quotation" to submit

### Test as Admin

1. Go to http://localhost:3000/admin (will redirect to admin login)
2. Or directly: http://localhost:3000/admin/login
3. Login with:
   - **Email**: admin@titec.com
   - **Password**: admin123
4. View the admin dashboard
5. Click "Quotation Requests" or "View Quotations"
6. See submitted quotations
7. Update their status (Mark Reviewed, Send Quote, Reject)

## ✅ Verification Checklist

**Customer Side:**
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Cannot see product prices
- [ ] Can add products to quotation cart
- [ ] Cart icon shows item count
- [ ] Can submit quotation request
- [ ] Cart clears after submission

**Admin Side:**
- [ ] Can login with admin credentials
- [ ] Cannot register through UI
- [ ] Can view dashboard with stats
- [ ] Can see all quotation requests
- [ ] Can update quotation status
- [ ] Can filter/search quotations
- [ ] Can see product prices in store (if admin visits store)

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists with correct MONGO_URL
- Check port 4900 is available

### Frontend won't start
- Check `.env.local` exists with NEXT_PUBLIC_BACKEND_URL
- Verify port 3000 is available
- Clear `.next` folder: `rm -rf .next` and restart

### Can't login
- Verify backend is running
- Check JWT_SECRET is set in backend `.env`
- Verify user exists in database
- Check browser console for errors

### Prices visible to customers
- Verify you're logged in as customer (not admin)
- Check AuthContext is properly wrapping the app
- Clear localStorage and login again

### Quotation not submitting
- Check backend URL in `.env.local`
- Verify CORS is enabled in backend
- Check browser console for errors
- Verify backend `/api/quotations` endpoint is accessible

## 📚 Next Steps

After successfully testing:

1. **Change Admin Password**: Login as admin and update the password
2. **Add More Admins**: Use the `createAdmin.js` script with different details
3. **Customize Products**: Update the products array in `src/app/store/page.tsx`
4. **Configure Email**: Set up email notifications (future enhancement)
5. **Deploy**: Follow deployment guide in QUOTATION_SYSTEM_README.md

## 🆘 Need Help?

1. Check **QUOTATION_SYSTEM_README.md** for detailed documentation
2. Check **IMPLEMENTATION_SUMMARY.md** for technical details
3. Review code comments in key files
4. Check browser console and server logs for errors

## 🎉 Success!

If all checks pass, you have successfully set up the quotation-based e-commerce system!

Customers can now browse products and request quotations, while admins can manage these requests efficiently.

---

**Quick Reference:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4900/api
- Customer Login: http://localhost:3000/login
- Admin Login: http://localhost:3000/admin/login
- Admin Panel: http://localhost:3000/admin
- Register Page: http://localhost:3000/register
