<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$data_post = array(
    'user' => $_SESSION['id'],
    'class' => $data['class'],
    'test' => $data['test'],
    'score' => $data['score'],
    'total_questions' => $data['total_questions'],
    'correct_answers' => $data['correct_answers'],
    'status' => $data['status'],
    'started_at' => $data['started_at'],
    'ended_at' => $data['ended_at']
);

$url_fetch = "testresult";

echo callApi('POST', $url_fetch, $data_post);
