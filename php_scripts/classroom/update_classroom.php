<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$class_id = $data['id'];
$new_name = $data['name'];

$data_post = array(
    'name' => $new_name
);

$url_fetch = "classroom/$class_id";

echo callApi('PUT', $url_fetch, $data_post);
