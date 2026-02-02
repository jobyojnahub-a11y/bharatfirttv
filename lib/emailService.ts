import nodemailer from 'nodemailer';

// Email configuration with provided credentials
const emailConfig = {
  host: 'mail.bharatfirsttv.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: 'login@bharatfirsttv.com',
    pass: 'otpsendkrnekapasswordhaiyrr'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: '"Bharat First TV" <login@bharatfirsttv.com>',
      to: email,
      subject: 'आपका OTP - Bharat First TV Login',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #D4110F, #FF6B6B); color: white; padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; text-align: center; }
            .otp-box { background-color: #f8f9fa; border: 2px dashed #D4110F; border-radius: 10px; padding: 30px; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #D4110F; letter-spacing: 8px; margin: 10px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; color: #856404; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🇮🇳 Bharat First TV</div>
              <p>आपका विश्वसनीय समाचार स्रोत</p>
            </div>
            
            <div class="content">
              <h2 style="color: #333; margin-bottom: 20px;">स्वागत है!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                आपका OTP कोड तैयार है। कृपया इसे 5 मिनट के अंदर उपयोग करें।
              </p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666; font-size: 14px;">आपका OTP कोड:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; color: #666; font-size: 12px;">यह कोड 5 मिनट में समाप्त हो जाएगा</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ सुरक्षा चेतावनी:</strong><br>
                • यह OTP किसी के साथ साझा न करें<br>
                • Bharat First TV कभी भी फोन पर OTP नहीं मांगता<br>
                • संदिग्ध गतिविधि की रिपोर्ट करें
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                यदि आपने यह अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें।
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 Bharat First TV. सभी अधिकार सुरक्षित।</p>
              <p>समाचार • विश्लेषण • सत्य</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

// Verify transporter configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}