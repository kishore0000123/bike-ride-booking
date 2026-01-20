const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use 'gmail', 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});

// Send OTP Email
const sendOTPEmail = async (customerEmail, customerName, otp, rideDetails) => {
  try {
    const mailOptions = {
      from: {
        name: "Bike Ride Booking",
        address: process.env.EMAIL_USER
      },
      to: customerEmail,
      subject: `🚴 Ride Booked! Your OTP: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: #22c55e; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-label { color: #64748b; font-size: 14px; }
            .detail-value { color: #0f172a; font-weight: bold; margin-top: 5px; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚴 Ride Booked Successfully!</h1>
              <p>Thank you for choosing our service</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>Your bike ride has been successfully booked! Here's your OTP to start the ride:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p style="text-align: center; color: #ef4444; font-weight: bold;">
                ⚠️ Share this OTP only with your rider
              </p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #1e293b;">📍 Ride Details</h3>
                
                <div class="detail-row">
                  <div class="detail-label">Pickup Location</div>
                  <div class="detail-value">📍 ${rideDetails.pickup}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Drop Location</div>
                  <div class="detail-value">🏁 ${rideDetails.drop}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Ride ID</div>
                  <div class="detail-value">#${rideDetails.rideId}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Status</div>
                  <div class="detail-value">⏳ Pending - Waiting for rider</div>
                </div>
                
                <div class="detail-row" style="border-bottom: none;">
                  <div class="detail-label">Booked At</div>
                  <div class="detail-value">${new Date().toLocaleString()}</div>
                </div>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f59e0b;">
                <strong>📌 Important:</strong>
                <ul style="margin: 10px 0;">
                  <li>A rider will be assigned shortly</li>
                  <li>You'll receive updates via email</li>
                  <li>Track your ride in real-time on our app</li>
                  <li>Give the OTP to the rider before starting the ride</li>
                </ul>
              </div>
              
              <div class="footer">
                <p>Need help? Contact us at support@bikeride.com</p>
                <p>&copy; 2026 Bike Ride Booking. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

// Send Ride Status Update Email
const sendRideStatusEmail = async (customerEmail, customerName, status, rideDetails) => {
  const statusMessages = {
    accepted: {
      subject: "✅ Rider Assigned!",
      title: "Your Rider is On the Way!",
      message: "A rider has been assigned to your ride. They will arrive at your pickup location shortly.",
      color: "#22c55e"
    },
    ongoing: {
      subject: "🚴 Ride Started!",
      title: "Your Ride is Now Ongoing",
      message: "Your rider has started the trip. Track your ride in real-time on the app.",
      color: "#3b82f6"
    },
    completed: {
      subject: "✅ Ride Completed!",
      title: "Thank You for Riding with Us!",
      message: "Your ride has been completed successfully. We hope you had a great experience!",
      color: "#22c55e"
    },
    cancelled: {
      subject: "❌ Ride Cancelled",
      title: "Ride Cancelled",
      message: "Your ride has been cancelled. You can book a new ride anytime.",
      color: "#ef4444"
    }
  };

  const statusInfo = statusMessages[status];

  try {
    const mailOptions = {
      from: {
        name: "Bike Ride Booking",
        address: process.env.EMAIL_USER
      },
      to: customerEmail,
      subject: statusInfo.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusInfo.color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${statusInfo.title}</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>${statusInfo.message}</p>
              <p><strong>Ride ID:</strong> #${rideDetails.rideId}</p>
              <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
                &copy; 2026 Bike Ride Booking. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ ${status} email sent successfully:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending ${status} email:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendRideStatusEmail
};
