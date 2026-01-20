# 📧 OTP EMAIL SYSTEM - Setup Guide

## ✅ What's Been Implemented

Your bike ride booking app now has a **COMPLETE OTP EMAIL NOTIFICATION SYSTEM**!

### 🎯 Features:

1. **✉️ OTP Email on Booking**
   - Beautiful HTML email template
   - OTP sent immediately when ride is booked
   - Ride details included (pickup, drop, ride ID)

2. **📬 Status Update Emails**
   - Email when rider accepts ride
   - Email when ride starts (ongoing)
   - Email when ride completes
   - Email if ride is cancelled

3. **🎨 Professional Email Design**
   - Gradient headers
   - Color-coded sections
   - Mobile-responsive
   - Clear OTP display

---

## 🚀 Email Configuration Setup

### **Option 1: Gmail (Recommended for Testing)**

#### **Step 1: Enable 2-Step Verification**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** (left sidebar)
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup process

#### **Step 2: Generate App Password**
1. Go back to **Security**
2. Under "Signing in to Google", click **App passwords**
3. Select app: **Mail**
4. Select device: **Other (Custom name)** → Enter "Bike Ride App"
5. Click **Generate**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

#### **Step 3: Update .env File**
Open `backend/.env` and update:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=xyzw abcd efgh ijkl
```

---

### **Option 2: Outlook/Hotmail**

Update `backend/.env`:
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

Update `backend/services/emailService.js`:
```javascript
const transporter = nodemailer.createTransport({
  service: "outlook",  // Changed from "gmail"
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

### **Option 3: Custom SMTP Server**

Update `backend/services/emailService.js`:
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.yourserver.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## 📋 Testing the Email System

### **Step 1: Configure Email**
1. Open `backend/.env`
2. Add your Gmail and App Password
3. Save the file

### **Step 2: Restart Backend Server**
```bash
# Stop the current backend server (Ctrl+C in terminal)
cd backend
npm start
```

### **Step 3: Book a Test Ride**
1. Go to `http://localhost:3000/map`
2. Enter customer details:
   - **Name:** Your Name
   - **Email:** YOUR-REAL-EMAIL@gmail.com ⚠️ **Use your real email!**
   - **Phone:** 9876543210
3. Click "Continue to Select Locations"
4. Click on map twice (pickup & drop)
5. Click "Confirm & Book Ride"

### **Step 4: Check Your Email** 📬
Within **5-10 seconds**, you should receive an email like this:

```
Subject: 🚴 Ride Booked! Your OTP: 1234

[Beautiful HTML Email with:]
- Large OTP display
- Pickup & Drop locations
- Ride ID
- Booking time
- Important instructions
```

---

## 📨 Email Templates

### **1. Booking Confirmation Email**
**Sent:** When ride is booked  
**Subject:** 🚴 Ride Booked! Your OTP: [OTP]  
**Contains:**
- OTP in large green box
- Pickup location
- Drop location
- Ride ID
- Status: Pending
- Booking timestamp

### **2. Rider Assigned Email**
**Sent:** When rider accepts the ride  
**Subject:** ✅ Rider Assigned!  
**Contains:**
- Confirmation message
- Ride ID
- Next steps

### **3. Ride Started Email**
**Sent:** When rider starts the ride  
**Subject:** 🚴 Ride Started!  
**Contains:**
- Live tracking notification
- Ride ID

### **4. Ride Completed Email**
**Sent:** When ride is completed  
**Subject:** ✅ Ride Completed!  
**Contains:**
- Thank you message
- Ride ID
- Feedback invitation

### **5. Ride Cancelled Email**
**Sent:** When ride is cancelled  
**Subject:** ❌ Ride Cancelled  
**Contains:**
- Cancellation notice
- Ride ID
- Rebooking option

---

## 🔧 How It Works

### **Data Flow:**

```
User Books Ride
     ↓
Frontend sends: { name, email, phone, pickup, drop }
     ↓
Backend creates ride in MongoDB
     ↓
Generates random 4-digit OTP
     ↓
Calls sendOTPEmail()
     ↓
Nodemailer sends email via Gmail SMTP
     ↓
User receives email with OTP
     ↓
User gives OTP to rider to start ride
```

---

## 📊 Backend Code Structure

### **Files Modified/Created:**

1. **`backend/services/emailService.js`** ✨ NEW
   - `sendOTPEmail()` - Sends OTP on booking
   - `sendRideStatusEmail()` - Sends status updates

2. **`backend/controllers/rideController.js`** 📝 UPDATED
   - Added email sending in `bookRide()`
   - Added email sending in `acceptRide()`
   - Added email sending in `startRide()`
   - Added email sending in `completeRide()`
   - Added email sending in `cancelRide()`

3. **`backend/models/Ride.js`** 📝 UPDATED
   - Added `customerEmail` field

4. **`backend/.env`** 📝 UPDATED
   - Added `EMAIL_USER` and `EMAIL_PASS`

5. **`frontend/src/pages/user/MapPage.jsx`** 📝 UPDATED
   - Added email input field
   - Email validation
   - Sends email in booking request

---

## ✅ Testing Checklist

- [ ] Gmail account configured with App Password
- [ ] `.env` file updated with email credentials
- [ ] Backend server restarted
- [ ] Book a ride with your real email
- [ ] Receive OTP email within 10 seconds
- [ ] Email has correct OTP
- [ ] Email shows ride details
- [ ] Rider accepts ride → Receive "Rider Assigned" email
- [ ] Rider starts ride → Receive "Ride Started" email
- [ ] Rider completes ride → Receive "Ride Completed" email

---

## 🚨 Troubleshooting

### **Problem 1: Email not received**

**Check Backend Console:**
```
✅ OTP Email sent successfully: <message-id>
```

If you see:
```
❌ Error sending OTP email: Invalid login
```

**Solution:**
- Verify Gmail App Password is correct
- Ensure 2-Step Verification is enabled
- Remove spaces from app password in .env

---

### **Problem 2: "Invalid login" error**

**Solutions:**
1. **Double-check App Password:**
   - Go to Google Account → Security → App Passwords
   - Generate a NEW app password
   - Copy it exactly (no spaces)

2. **Enable "Less secure app access" (Not recommended):**
   - Go to Google Account → Security
   - Turn ON "Less secure app access"
   - Note: Google is phasing this out, use App Passwords instead

---

### **Problem 3: Emails go to spam**

**Solutions:**
1. Check your spam/junk folder
2. Mark email as "Not Spam"
3. Add sender to contacts

---

## 📧 Sample Email Preview

```html
┌────────────────────────────────────────┐
│                                        │
│   🚴 Ride Booked Successfully!        │
│   Thank you for choosing our service   │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  Hi John Doe,                          │
│                                        │
│  Your bike ride has been successfully  │
│  booked! Here's your OTP:              │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │         1  2  3  4               │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ⚠️ Share this OTP only with rider     │
│                                        │
│  📍 Ride Details                       │
│  ├─ Pickup: MG Road, Bangalore        │
│  ├─ Drop: Whitefield, Bangalore       │
│  ├─ Ride ID: #abc123                  │
│  ├─ Status: Pending                   │
│  └─ Booked: Jan 18, 2026 10:30 AM    │
│                                        │
│  📌 Important:                         │
│  • A rider will be assigned shortly    │
│  • Track your ride in real-time       │
│  • Give OTP before starting            │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎯 Next Steps

1. ✅ **Configure your email** in `.env`
2. ✅ **Restart backend server**
3. ✅ **Book a test ride** with your real email
4. ✅ **Check your inbox** for the OTP email
5. ✅ **Test the full flow:**
   - Book ride → Receive OTP email
   - Rider accepts → Receive acceptance email
   - Rider starts → Receive started email
   - Rider completes → Receive completion email

---

## 🎉 YOU NOW HAVE A FULL EMAIL NOTIFICATION SYSTEM!

Your app can now:
- ✉️ Send OTP via email when ride is booked
- 📧 Send status updates at every stage
- 🎨 Beautiful HTML email templates
- 📱 Mobile-responsive emails
- 🔒 Secure App Password authentication

**Ready to test! Just configure your email and book a ride!** 🚀
