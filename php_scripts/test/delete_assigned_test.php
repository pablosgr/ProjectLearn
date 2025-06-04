<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$class_id = $data['classid'];
$test_id = $data['testid'];

$url_fetch = "assignedtests/classroom/$class_id/test/$test_id";

echo callApi('DELETE', $url_fetch);
