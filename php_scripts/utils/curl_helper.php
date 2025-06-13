<?php
function callApi($method, $endpoint, $data = []) {
    $ch = curl_init();
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); if necessary
    curl_setopt($ch, CURLOPT_URL, 'http://nginx/api/'.$endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json'
    ));

    if (!empty($data)) {
        // If there is a request body, adds it to curl
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}
