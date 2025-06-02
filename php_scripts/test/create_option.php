<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$data_post = array(
    'question' => $data['question'],
    'option_text' => $data['option_text'],
    'is_correct' => $data['is_correct'],
    'index_order' => $data['index_order']
);

$url_fetch = "option";

echo callApi('POST', $url_fetch, $data_post);
