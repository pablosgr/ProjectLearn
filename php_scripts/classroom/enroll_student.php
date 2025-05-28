<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$class_id = $data['classroom_id'];
$user_id = $_SESSION['id'];

$data_post = array(
    'classroom_id' => $class_id,
    'student_id' => $user_id
);

$url_fetch = "enrollment";

echo callApi('POST', $url_fetch, $data_post);
