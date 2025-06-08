<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$query_string = '';

if (isset($data['user_id'])) {
    $new_field = 'student';
    $field_value = $data['user_id'];
    $query_string .= "$new_field=$field_value";
}

if (isset($data['class_id'])) {
    $new_field = 'classroom';
    $field_value = $data['class_id'];
    if (!empty($query_string)) {
        $query_string .= '&';
    }
    $query_string .= "$new_field=$field_value";
}

if (isset($fields['test'])) {
    $new_field = 'test';
    $field_value = $data['test_id'];
    if (!empty($query_string)) {
        $query_string .= '&';
    }
    $query_string .= "$new_field=$field_value";
}

$url_fetch = "testresult/search?$query_string";

echo callApi('GET', $url_fetch);
