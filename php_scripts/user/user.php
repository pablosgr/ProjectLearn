<?php
require_once '../header.php';
require_once '../utils/curl_helper.php';

echo callApi('GET', 'user');
