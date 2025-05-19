<?php
session_start();
require_once '../header.php';

if (!isset($_SESSION["id"])) {
    echo json_encode([
        'message' => 'Failed',
        'message' => 'User not authenticated'
    ]);
    exit;
}

$userData = [
    'id' => $_SESSION["id"],
    'name' => $_SESSION["name"],
    'username' => $_SESSION["username"],
    'email' => $_SESSION["email"],
    'role' => $_SESSION["role"]
];

echo json_encode([
    'message' => 'Success',
    'user' => $userData
]);
