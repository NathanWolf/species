<?php
if (!isset($_REQUEST['name'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing name parameter')));
}
if (!isset($_REQUEST['question'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing question parameter')));
}
if (!isset($_REQUEST['answer'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing answer parameter')));
}

try {
    require_once('Database.class.php');

    $response = array('success' => true);
    $db = new Database();
    
    $commonName = isset($_REQUEST['common_name']) ? $_REQUEST['common_name'] : null;
    $description = isset($_REQUEST['description']) ? $_REQUEST['description'] : null;
    $imageUrl = isset($_REQUEST['image_url']) ? $_REQUEST['image_url'] : null;
    $wikiUrl = isset($_REQUEST['wiki_url']) ? $_REQUEST['wiki_url'] : null;
    
    $questionId = $db->getQuestionid($_REQUEST['question']);
    $answerId = $db->getAnswerId($_REQUEST['answer']);
    $questions = array();
    $questions[$questionId] = $answerId;
    
    $id = $db->add($_REQUEST['name'], $commonName, $description, $imageUrl, $wikiUrl, $questions);
    $response['message'] = 'Added id ' . $id;
    echo json_encode($response, true);
} catch (Exception $ex) {
    error_log($ex);
    die(json_encode(array('success' => false, 'message' => 'Failed to save data')));
}
