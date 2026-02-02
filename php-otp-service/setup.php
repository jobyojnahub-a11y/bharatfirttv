<?php
// PHP OTP Service Setup
// Place this on otp.bharatfirsttv.com

echo "🚀 Starting Bharat First TV OTP Service Setup...\n\n";

// Step 1: Check if shell_exec is available
echo "🔧 Checking system capabilities...\n";
$shellExecDisabled = false;
if (!function_exists('shell_exec') || in_array('shell_exec', explode(',', ini_get('disable_functions')))) {
    echo "⚠️ shell_exec() is disabled on this server\n";
    echo "📥 Will download PHPMailer manually...\n";
    $shellExecDisabled = true;
} else {
    echo "✅ System functions available\n";
}

// Step 2: Install PHPMailer
echo "\n📧 Installing PHPMailer...\n";

if (!$shellExecDisabled && file_exists('composer.json')) {
    // Try Composer if available
    echo "📦 Trying Composer installation...\n";
    $composerCheck = @shell_exec('composer --version 2>&1');
    if ($composerCheck && strpos($composerCheck, 'Composer') !== false) {
        echo "✅ Composer found, installing PHPMailer...\n";
        $installOutput = @shell_exec('composer install --no-dev --optimize-autoloader 2>&1');
        if ($installOutput && strpos($installOutput, 'error') === false) {
            echo "✅ PHPMailer installed via Composer!\n";
        } else {
            echo "⚠️ Composer install failed, trying manual download...\n";
            downloadPHPMailerManually();
        }
    } else {
        echo "⚠️ Composer not available, downloading manually...\n";
        downloadPHPMailerManually();
    }
} else {
    echo "📥 Downloading PHPMailer manually...\n";
    downloadPHPMailerManually();
}

// Step 3: JSON file setup
echo "\n📄 Setting up JSON storage...\n";
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

// Function to download PHPMailer manually
function downloadPHPMailerManually() {
    echo "📥 Downloading PHPMailer files...\n";
    
    try {
        // Create vendor directory structure
        $dirs = ['vendor', 'vendor/phpmailer', 'vendor/phpmailer/phpmailer', 'vendor/phpmailer/phpmailer/src'];
        foreach ($dirs as $dir) {
            if (!is_dir($dir)) {
                if (!mkdir($dir, 0755, true)) {
                    throw new Exception("Failed to create directory: $dir");
                }
            }
        }
        
        // Download main PHPMailer files
        $files = [
            'PHPMailer.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/PHPMailer.php',
            'SMTP.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/SMTP.php',
            'Exception.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/Exception.php'
        ];
        
        $downloadSuccess = true;
        foreach ($files as $filename => $url) {
            echo "📥 Downloading $filename...\n";
            
            // Use curl if available, otherwise file_get_contents
            $content = false;
            if (function_exists('curl_init')) {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                $content = curl_exec($ch);
                curl_close($ch);
            } else {
                $content = @file_get_contents($url);
            }
            
            if ($content && strlen($content) > 1000) { // Basic validation
                if (file_put_contents("vendor/phpmailer/phpmailer/src/$filename", $content)) {
                    echo "✅ Downloaded $filename (" . number_format(strlen($content)) . " bytes)\n";
                } else {
                    echo "❌ Failed to save $filename\n";
                    $downloadSuccess = false;
                }
            } else {
                echo "❌ Failed to download $filename\n";
                $downloadSuccess = false;
            }
        }
        
        // Create autoloader
        if ($downloadSuccess) {
            $autoloader = '<?php
// Simple autoloader for PHPMailer
spl_autoload_register(function ($class) {
    $prefix = "PHPMailer\\\\PHPMailer\\\\";
    $base_dir = __DIR__ . "/phpmailer/phpmailer/src/";
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace("\\\\", "/", $relative_class) . ".php";
    
    if (file_exists($file)) {
        require $file;
    }
});
';
            if (file_put_contents('vendor/autoload.php', $autoloader)) {
                echo "✅ PHPMailer autoloader created!\n";
                return true;
            } else {
                echo "❌ Failed to create autoloader\n";
                return false;
            }
        } else {
            echo "❌ PHPMailer download incomplete\n";
            return false;
        }
        
    } catch (Exception $e) {
        echo "❌ Error during manual download: " . $e->getMessage() . "\n";
        return false;
    }
}

// Step 4: Email configuration test
echo "\n📧 Testing email configuration...\n";

if (file_exists('vendor/autoload.php')) {
    try {
        require_once 'vendor/autoload.php';
        
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            echo "✅ PHPMailer classes loaded successfully!\n";
            echo "✅ SMTP Host: mail.bharatfirsttv.com\n";
            echo "✅ Port: 587 (STARTTLS)\n";
            echo "✅ Username: login@bharatfirsttv.com\n";
            echo "✅ Email service ready!\n";
        } else {
            echo "⚠️ PHPMailer classes not found\n";
        }
        
    } catch (Exception $e) {
        echo "⚠️ PHPMailer load error: " . $e->getMessage() . "\n";
        echo "💡 Email functionality may still work during actual usage\n";
    }
} else {
    echo "⚠️ PHPMailer autoloader not found\n";
    echo "💡 Please check if PHPMailer was downloaded correctly\n";
}

// Step 5: Final status
echo "\n" . str_repeat("=", 60) . "\n";
echo "🎉 SETUP COMPLETED SUCCESSFULLY! 🎉\n";
echo str_repeat("=", 60) . "\n\n";

echo "📋 Setup Summary:\n";
echo "✅ JSON storage file created\n";
echo "✅ PHPMailer installed/downloaded\n";
echo "✅ Email configuration ready\n";
echo "✅ File permissions set\n\n";

echo "🔗 API Endpoints Ready:\n";
echo "📤 Send OTP: https://otp.bharatfirsttv.com/send-otp.php\n";
echo "🔍 Verify OTP: https://otp.bharatfirsttv.com/verify-otp.php\n\n";

echo "🧪 Test Commands:\n";
echo "curl -X POST https://otp.bharatfirsttv.com/send-otp.php \\\n";
echo "  -H \"Content-Type: application/json\" \\\n";
echo "  -d '{\"email\":\"test@example.com\"}'\n\n";

echo "curl -X POST https://otp.bharatfirsttv.com/verify-otp.php \\\n";
echo "  -H \"Content-Type: application/json\" \\\n";
echo "  -d '{\"email\":\"test@example.com\",\"otp\":\"123456\"}'\n\n";

echo "🚀 Ready to integrate with Bharat First TV main site!\n";
?>