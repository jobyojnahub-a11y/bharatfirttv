<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://bharatfirsttv.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';

// Validate email
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Valid email is required']);
    exit;
}

// JSON file handling
$otpFile = 'otp.json';

try {
    // Generate 6-digit OTP
    $otp = sprintf('%06d', mt_rand(100000, 999999));
    
    // Set expiry time (5 minutes from now)
    $expiresAt = time() + 300;
    
    // Read existing data
    $data = [];
    if (file_exists($otpFile)) {
        $jsonContent = file_get_contents($otpFile);
        $data = json_decode($jsonContent, true) ?: ['sessions' => []];
    } else {
        $data = ['sessions' => []];
    }
    
    // Clean expired sessions and sessions for this email
    $currentTime = time();
    $data['sessions'] = array_filter($data['sessions'], function($session) use ($email, $currentTime) {
        return $session['email'] !== $email && $session['expires_at'] > $currentTime;
    });
    
    // Add new OTP session
    $data['sessions'][] = [
        'email' => $email,
        'otp' => $otp,
        'expires_at' => $expiresAt,
        'attempts' => 0,
        'created_at' => time()
    ];
    
    // Save to file
    if (!file_put_contents($otpFile, json_encode($data, JSON_PRETTY_PRINT))) {
        throw new Exception('Failed to save OTP data');
    }
    
    // Send email using PHPMailer
    require_once 'vendor/autoload.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    
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
        
        // Recipients
        $mail->setFrom('login@bharatfirsttv.com', 'Bharat First TV');
        $mail->addAddress($email);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'आपका OTP - Bharat First TV Login';
        $mail->Body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
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
            <div class='container'>
                <div class='header'>
                    <div class='logo'>🇮🇳 भारत फर्स्ट टीवी</div>
                    <p>आपका विश्वसनीय समाचार स्रोत</p>
                </div>
                
                <div class='content'>
                    <h2 style='color: #333; margin-bottom: 20px;'>लॉगिन OTP</h2>
                    <p style='color: #666; font-size: 16px; margin-bottom: 30px;'>
                        आपके Bharat First TV खाते में लॉगिन करने के लिए नीचे दिया गया OTP उपयोग करें:
                    </p>
                    
                    <div class='otp-box'>
                        <p style='margin: 0; color: #666; font-size: 14px;'>आपका OTP कोड:</p>
                        <div class='otp-code'>{$otp}</div>
                        <p style='margin: 10px 0 0 0; color: #666; font-size: 12px;'>यह कोड 5 मिनट में समाप्त हो जाएगा</p>
                    </div>
                    
                    <div class='warning'>
                        <strong>⚠️ सुरक्षा चेतावनी:</strong><br>
                        • यह OTP किसी के साथ साझा न करें<br>
                        • यदि आपने यह अनुरोध नहीं किया है, तो इसे अनदेखा करें<br>
                        • OTP केवल 5 मिनट के लिए वैध है
                    </div>
                    
                    <p style='color: #666; font-size: 14px; margin-top: 30px;'>
                        समस्या हो रही है? हमसे संपर्क करें: <a href='mailto:support@bharatfirsttv.com' style='color: #D4110F;'>support@bharatfirsttv.com</a>
                    </p>
                </div>
                
                <div class='footer'>
                    <p>© 2026 Bharat First TV. सभी अधिकार सुरक्षित।</p>
                    <p>यह एक स्वचालित ईमेल है, कृपया इसका उत्तर न दें।</p>
                </div>
            </div>
        </body>
        </html>";
        
        $mail->send();
        
        echo json_encode([
            'success' => true,
            'message' => 'OTP sent successfully to your email'
        ]);
        
    } catch (Exception $e) {
        // Log error but still return success for security
        error_log("PHPMailer Error: " . $mail->ErrorInfo);
        
        echo json_encode([
            'success' => false,
            'error' => 'Failed to send OTP email'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
    error_log("JSON file error: " . $e->getMessage());
}
?>