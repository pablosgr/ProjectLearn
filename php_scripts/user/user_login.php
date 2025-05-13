<?php
require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

echo callApi('POST', 'user/login', $data);
