<?php
/**
 * Contact form endpoint — Viva Algérie
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

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subjectField = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($name === '' || strlen($name) > 120) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid name']);
    exit;
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email']);
    exit;
}

if ($subjectField === '' || strlen($subjectField) > 180) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid subject']);
    exit;
}

if ($message === '' || strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid message']);
    exit;
}

$nameSafe = str_replace(["\r", "\n"], '', $name);
$emailSafe = str_replace(["\r", "\n"], '', $email);
$subjectSafe = str_replace(["\r", "\n"], '', $subjectField);

$to = 'contact@vivaalgerie.com';
$subject = 'Nouveau message — Viva Algérie — ' . $subjectSafe;
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$date = date('c');

$body = "Nouveau message — Viva Algérie\n\n"
    . "Nom: {$nameSafe}\n"
    . "Email: {$emailSafe}\n"
    . "Sujet: {$subjectSafe}\n"
    . "Date: {$date}\n"
    . "IP: {$ip}\n\n"
    . "Message:\n{$message}\n";

$headers = [
    'From: noreply@vivaalgerie.com',
    'Reply-To: ' . $emailSafe,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail failed']);
    exit;
}

echo json_encode(['ok' => true]);
