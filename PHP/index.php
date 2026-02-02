<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Get a Free Consultation</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<div class="form-container">
    <div class="form-header">
        <div class="form-title">
            <h2>Get a Free Consultation</h2>
            <p>Share your requirement — we'll call you back.</p>
        </div>
        <div class="availability-badge">
            <span class="dot"></span> Available Today
        </div>
    </div>

    <form action="send_mail.php" method="POST">
        <div class="row form-group">
            <div class="col">
                <input type="text" name="name" placeholder="Your Name" required>
            </div>
            <div class="col">
                <input type="tel" name="phone" placeholder="Phone Number" pattern="[0-9]{10,15}" title="Please enter a valid phone number" required>
            </div>
        </div>

        <div class="form-group">
            <input type="email" name="email" placeholder="Email (optional)">
        </div>

        <div class="form-group">
            <select name="service" required>
                <option value="" disabled selected>Select Service</option>
                <option value="Consultation">General Consultation</option>
                <option value="Property Buying">Property Buying</option>
                <option value="Property Selling">Property Selling</option>
                <option value="Renting">Renting</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <button type="submit" class="submit-btn">Request Callback</button>
        
        <div class="disclaimer">
            By submitting, you agree to be contacted by S&Y Property Consultants.
        </div>
    </form>
</div>

</body>
</html>
