<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$data_post = array(
    'test' => $data['test'],
    'question_text' => $data['question_text']
);

$url_fetch = "question";

echo callApi('POST', $url_fetch, $data_post);
