<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$test_id = $data['id'];

$url_fetch = "test/$test_id";

echo callApi('DELETE', $url_fetch);
