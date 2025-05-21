<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

// $json = file_get_contents('php://input');
// $data = json_decode($json, true);

$user_id = $_SESSION["id"];
$url_fetch = "enrollment/student/$user_id/classrooms";

echo callApi('GET', $url_fetch);
