<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$classroom_id = $data['id'];

$url_fetch = "classroom/$classroom_id";

echo callApi('DELETE', $url_fetch);
