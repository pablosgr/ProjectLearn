<?php
session_start();

require_once '../header.php';

if (!isset($_SESSION["id"])) {
    echo json_encode([
        'error' => 'Failed to validate user session'
    ]);
} else {
    echo json_encode([
        'success' => 'Session validation successful'
    ]);
}
