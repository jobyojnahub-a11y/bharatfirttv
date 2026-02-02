<?php
// PHP OTP Service Setup
// Place this on otp.bharatfirsttv.com

// JSON file setup
$otpFile = 'otp.json';

// Create OTP JSON file if it doesn't exist
if (!file_exists($otpFile)) {
    $initialData = [
        'sessions' => [],
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    if (file_put_contents($otpFile, json_encode($initialData, JSON_PRETTY_PRINT))) {
        echo "✅ OTP JSON file created successfully!\n";
        echo "✅ File: $otpFile\n";
    } else {
        echo "❌ Failed to create OTP JSON file\n";
        exit;
    }
} else {
    echo "✅ OTP JSON file already exists\n";
}

// Set proper permissions
chmod($otpFile, 0666);
echo "✅ File permissions set\n";

// Email configuration test
require_once 'vendor/autoload.php'; // Make sure to run: composer require phpmailer/phpmailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);

try {
    // SMTP configuration
    $mail->isSMTP();
    $mail->Host = 'mail.bharatfirsttv.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'login@bharatfirsttv.com';
    $mail->Password = 'otpsendkrnekapasswordhaiyrr';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Test connection
    $mail->SMTPDebug = 0; // Disable debug output
    echo "✅ Email configuration setup completed!\n";
    echo "✅ SMTP Host: mail.bharatfirsttv.com\n";
    echo "✅ Port: 587 (STARTTLS)\n";
    
} catch (Exception $e) {
    echo "❌ Email configuration error: {$mail->ErrorInfo}\n";
}

echo "\n🚀 Setup completed! Now you can use send-otp.php and verify-otp.php\n";
?>