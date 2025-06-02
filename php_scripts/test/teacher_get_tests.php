<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$teacher_id = $_SESSION['id'];

$url_fetch = "test/author?value=$teacher_id";

echo callApi('GET', $url_fetch);
