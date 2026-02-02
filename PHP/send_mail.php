<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input
    $name = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $email = strip_tags(trim($_POST["email"]));
    $service = strip_tags(trim($_POST["service"]));

    // Check required fields
    if (empty($name) || empty($phone) || empty($service)) {
        echo "Please fill in all required fields.";
        exit;
    }

    // Email Configuration
    $to = "mkcmukesh@gmail.com"; // REPLACE THIS WITH YOUR ACTUAL EMAIL
    $subject = "New Consultation Request from $name";
    
    $message = "You have received a new inquiry.\n\n";
    $message .= "Name: $name\n";
    $message .= "Phone: $phone\n";
    if (!empty($email)) {
        $message .= "Email: $email\n";
    }
    $message .= "Service: $service\n";

    $headers = "From: no-reply@example.com\r\n"; // REPLACE DOMAIN
    if (!empty($email)) {
        $headers .= "Reply-To: $email\r\n";
    }

    // Send Email
    // Use @ to suppress warning messages on localhost
    if (@mail($to, $subject, $message, $headers)) {
        // Redirect to a thank you page
        header("Location: thankyou.php");
        exit;
    } else {
        // Fallback for Localhost:
        // Since XAMPP is not configured to send mail by default, we will log it to a file
        // so you can verify the 'sending' worked.
        $logFile = 'email_log.txt';
        $logMessage = "Date: " . date('Y-m-d H:i:s') . "\n";
        $logMessage .= "To: $to\n";
        $logMessage .= "Subject: $subject\n";
        $logMessage .= "Headers: $headers\n";
        $logMessage .= "Body: \n$message\n";
        $logMessage .= "--------------------------------------------------\n\n";
        
        file_put_contents($logFile, $logMessage, FILE_APPEND);
        
        // Redirect to thank you page pretending it worked
        header("Location: thankyou.php");
        exit;
    }
} else {
    // Not a POST request
    header("Location: index.php");
    exit;
}
?>
