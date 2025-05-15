<?php

function isAuthenticated() {
    return isset($SESSION['id']);
}

function requireAuth() {
    if (!isAuthenticated()) {
        echo json_encode([
            'error' => 'Failed to validate user session'
        ]);
        exit;
    }
    echo json_encode([
        'success' => 'Session validation successful'
    ]);
}
