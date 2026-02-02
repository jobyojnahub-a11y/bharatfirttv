# PHP OTP Service for Bharat First TV

## Setup Instructions

### 1. Upload to Subdomain
Upload all files to `otp.bharatfirsttv.com` directory

### 2. Install Dependencies
```bash
cd /path/to/otp.bharatfirsttv.com
composer install
```

### 3. JSON File Setup
```bash
# Run setup (creates otp.json file)
php setup.php
```

### 4. Configure Email
Edit the email credentials in:
- `send-otp.php` (lines 45-50)
- `setup.php` (lines 35-40)

Update:
```php
$mail->Host = 'mail.bharatfirsttv.com';
$mail->Username = 'login@bharatfirsttv.com';
$mail->Password = 'otpsendkrnekapasswordhaiyrr';
```

### 5. Update Next.js API Routes

Update your Next.js API routes to use the PHP service:

**bharatfirsttv/app/api/auth/send-otp/route.ts:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const response = await fetch('https://otp.bharatfirsttv.com/send-otp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**bharatfirsttv/app/api/auth/verify-otp/route.ts:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    const response = await fetch('https://otp.bharatfirsttv.com/verify-otp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp })
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 6. Test the Service

1. **Send OTP:**
```bash
curl -X POST https://otp.bharatfirsttv.com/send-otp.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

2. **Verify OTP:**
```bash
curl -X POST https://otp.bharatfirsttv.com/verify-otp.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

## Features

- ✅ PHPMailer integration
- ✅ JSON file storage (no database needed)
- ✅ OTP expiry (5 minutes)
- ✅ Attempt limiting (3 attempts)
- ✅ CORS headers for bharatfirsttv.com
- ✅ Beautiful HTML email template
- ✅ Error handling and logging
- ✅ Security features
- ✅ Simple file-based storage

## File Structure

```
otp.bharatfirsttv.com/
├── setup.php          # JSON file and email setup
├── send-otp.php       # Send OTP API endpoint
├── verify-otp.php     # Verify OTP API endpoint
├── otp.json          # OTP sessions storage
├── composer.json      # Dependencies
├── composer.lock      # Lock file (auto-generated)
├── vendor/           # Dependencies (auto-generated)
└── README.md         # This file
```

## Security Notes

- OTPs expire in 5 minutes
- Maximum 3 verification attempts
- CORS restricted to bharatfirsttv.com
- JSON file permissions set to 0666 for read/write
- Email credentials should be secured
- Automatic cleanup of expired sessions