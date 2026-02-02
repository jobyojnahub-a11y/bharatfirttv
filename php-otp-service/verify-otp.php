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
$otp = $input['otp'] ?? '';

// Validate input
if (!$email || !$otp) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and OTP are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Valid email is required']);
    exit;
}

// JSON file handling
$otpFile = 'otp.json';

try {
    // Read existing data
    if (!file_exists($otpFile)) {
        echo json_encode([
            'success' => false,
            'error' => 'No OTP sessions found. Please request a new OTP.'
        ]);
        exit;
    }
    
    $jsonContent = file_get_contents($otpFile);
    $data = json_decode($jsonContent, true);
    
    if (!$data || !isset($data['sessions'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid OTP data. Please request a new OTP.'
        ]);
        exit;
    }
    
    $currentTime = time();
    
    // Clean expired sessions
    $data['sessions'] = array_filter($data['sessions'], function($session) use ($currentTime) {
        return $session['expires_at'] > $currentTime;
    });
    
    // Find OTP session for this email
    $session = null;
    $sessionIndex = null;
    
    foreach ($data['sessions'] as $index => $s) {
        if ($s['email'] === $email) {
            $session = $s;
            $sessionIndex = $index;
            break;
        }
    }
    
    if (!$session) {
        echo json_encode([
            'success' => false,
            'error' => 'No OTP session found. Please request a new OTP.'
        ]);
        exit;
    }
    
    // Check if OTP is expired
    if ($session['expires_at'] < $currentTime) {
        // Remove expired session
        unset($data['sessions'][$sessionIndex]);
        $data['sessions'] = array_values($data['sessions']); // Re-index array
        file_put_contents($otpFile, json_encode($data, JSON_PRETTY_PRINT));
        
        echo json_encode([
            'success' => false,
            'error' => 'OTP has expired. Please request a new one.'
        ]);
        exit;
    }
    
    // Check attempts limit
    if ($session['attempts'] >= 3) {
        // Remove session after too many attempts
        unset($data['sessions'][$sessionIndex]);
        $data['sessions'] = array_values($data['sessions']); // Re-index array
        file_put_contents($otpFile, json_encode($data, JSON_PRETTY_PRINT));
        
        echo json_encode([
            'success' => false,
            'error' => 'Too many attempts. Please request a new OTP.'
        ]);
        exit;
    }
    
    // Verify OTP
    if ($session['otp'] !== $otp) {
        // Increment attempts
        $data['sessions'][$sessionIndex]['attempts']++;
        file_put_contents($otpFile, json_encode($data, JSON_PRETTY_PRINT));
        
        $remainingAttempts = 3 - $data['sessions'][$sessionIndex]['attempts'];
        echo json_encode([
            'success' => false,
            'error' => "Invalid OTP. {$remainingAttempts} attempts remaining."
        ]);
        exit;
    }
    
    // OTP verified successfully - remove session
    unset($data['sessions'][$sessionIndex]);
    $data['sessions'] = array_values($data['sessions']); // Re-index array
    file_put_contents($otpFile, json_encode($data, JSON_PRETTY_PRINT));
    
    // Mock user data (you can integrate with your main database here)
    $userData = [
        'id' => 1,
        'name' => 'User',
        'email' => $email,
        'role' => 'user',
        'isVerified' => true
    ];
    
    echo json_encode([
        'success' => true,
        'user' => $userData,
        'isNewUser' => false, // You can check your main database here
        'message' => 'OTP verified successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
    error_log("JSON file error: " . $e->getMessage());
}
?>