<?php
// Всегда возвращаем JSON
header('Content-Type: application/json; charset=UTF-8');

// 1) Принимаем только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error'=>'Method Not Allowed']);
  exit;
}

// 2) Читаем поля
$name    = trim($_POST['name']    ?? '');
$phone   = trim($_POST['phone']   ?? '');
$email   = trim($_POST['email']   ?? '');
$consent = isset($_POST['pd-consent']) ? 'Да' : 'Нет';
$ip      = $_SERVER['REMOTE_ADDR'] ?? '';

// 3) Валидация
if (!$name || !$phone || !$email || $consent === 'Нет') {
  http_response_code(400);
  echo json_encode(['error'=>'Пожалуйста, заполните все поля и дайте согласие']);
  exit;
}

// 4) Файл CSV
$csvFile = __DIR__ . '/submissions.csv';
// Если файл ещё не существует — создаём и пишем заголовок
if (!file_exists($csvFile)) {
  file_put_contents($csvFile, "Timestamp,Name,Phone,Email,Consent,IP\n", LOCK_EX);
}

// 5) Добавляем строку
$timestamp = date('c');
$row = [$timestamp, $name, $phone, $email, $consent, $ip];
if (($fp = fopen($csvFile, 'a')) !== false) {
  // Явно передаём все параметры fputcsv
  fputcsv($fp, $row, ',', '"', '\\');
  fclose($fp);
} else {
  http_response_code(500);
  echo json_encode(['error'=>'Не удалось записать в файл']);
  exit;
}

// 6) Всё ок
echo json_encode(['status'=>'ok']);
