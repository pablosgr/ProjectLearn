<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$user_id = $_SESSION["id"];
$url_fetch = "user/$user_id";

$api_response = callApi('PUT', $url_fetch, $data);
$response_data = json_decode($api_response, true);

if (isset($response_data['message'])) {
    $_SESSION["name"] = $data['name'];
    $_SESSION["username"] = $data['username'];
}

echo $api_response;
