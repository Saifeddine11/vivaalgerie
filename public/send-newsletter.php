<?php
/**
 * Newsletter subscription endpoint — Viva Algérie
 * Deploy to public_html alongside the static site.
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Honeypot
if (!empty($_POST['website'])) {
    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$locale = isset($_POST['locale']) ? trim($_POST['locale']) : 'fr';

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email']);
    exit;
}

if (strlen($email) > 190) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email too long']);
    exit;
}

$to = 'contact@vivaalgerie.com';
$subject = 'Nouvelle inscription newsletter — Viva Algérie';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$date = date('c');

$body = "Nouvelle inscription newsletter — Viva Algérie\n\n"
    . "Email: {$email}\n"
    . "Locale: {$locale}\n"
    . "Date: {$date}\n"
    . "IP: {$ip}\n"
    . "User-Agent: {$ua}\n";

$headers = [
    'From: noreply@vivaalgerie.com',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail failed']);
    exit;
}

echo json_encode(['ok' => true]);
