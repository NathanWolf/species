<?php
if (!isset($_REQUEST['species'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing species parameter')));
}
if (!isset($_REQUEST['answers'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing answers parameter')));
}

try {
    require_once('Database.class.php');
    $response = array('success' => true);
    $db = new Database();
    $speciesId = $_REQUEST['species'];
    $answers = $_REQUEST['answers'];
    $db->addAnswers($speciesId, $answers);
    
    echo json_encode($response, true);
} catch (Exception $ex) {
    error_log($ex);
    die(json_encode(array('success' => false, 'message' => 'Failed to save data')));
}
