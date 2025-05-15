<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$api_response = callApi('POST', 'user/login', $data);
$response_data = json_decode($api_response, true);

if (isset($data['user'])) {
    $_SESSION["id"] = $response_data['user']['id'];
    $_SESSION["name"] = $response_data['user']['name'];
    $_SESSION["username"] = $response_data['user']['username'];
    $_SESSION["email"] = $response_data['user']['email'];
    $_SESSION["role"] = $response_data['user']['role'];
}

echo $api_response;
