<?php
if (!isset($_REQUEST['name'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing name parameter')));
}

try {
    require_once('Database.class.php');

    $response = array('success' => true);
    $db = new Database();
    
    $commonName = isset($_REQUEST['common_name']) ? $_REQUEST['common_name'] : null;
    $description = isset($_REQUEST['description']) ? $_REQUEST['description'] : null;
    $imageUrl = isset($_REQUEST['image_url']) ? $_REQUEST['image_url'] : null;
    $wikiUrl = isset($_REQUEST['wiki_url']) ? $_REQUEST['wiki_url'] : null;

    $answers = array();
    if (isset($_REQUEST['new_answers'])) {
        $newQuestions = $_REQUEST['new_answers'];
        foreach ($newQuestions as $newQuestion => $newAnswer) {
            $questionId = $db->getQuestionId($newQuestion);
            $answerId = $db->getAnswerId($newAnswer);
            $answers[$questionId] = $answerId;
        }
    }
    if (isset($_REQUEST['answers'])) {
        $answers = $answers + $_REQUEST['answers'];
    }
    
    $id = $db->add($_REQUEST['name'], $commonName, $description, $imageUrl, $wikiUrl, $answers);
    $response['message'] = 'Added id ' . $id;
    echo json_encode($response, true);
} catch (Exception $ex) {
    error_log($ex);
    die(json_encode(array('success' => false, 'message' => 'Failed to save data')));
}
