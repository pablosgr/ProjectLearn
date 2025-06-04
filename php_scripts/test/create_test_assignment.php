<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$data_post = array(
    'classroom_id' => $data['classroom_id'],
    'test_id' => $data['test_id'],
    'due_date' => $data['due_date'],
    'time_limit' => $data['time_limit'],
    'visibility' => $data['visibility'],
    'is_mandatory' => $data['is_mandatory']
);

$url_fetch = "assignedtests";

echo callApi('POST', $url_fetch, $data_post);
