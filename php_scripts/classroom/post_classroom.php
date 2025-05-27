<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$user_id = $_SESSION['id'];
$classroom_name = $data['className'];

$data_post = array(
    'name' => $classroom_name,
    'teacher' => $user_id
);

$url_fetch = "classroom";

echo callApi('POST', $url_fetch, $data_post);
