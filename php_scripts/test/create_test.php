<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$data_post = array(
    'name' => $data['name'],
    'category' => $data['category'],
    'author' => $_SESSION['id']
);

$url_fetch = "test";

echo callApi('POST', $url_fetch, $data_post);
