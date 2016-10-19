<?php
if (!isset($_REQUEST['species'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing species parameter')));
}

try {
    require_once('Database.class.php');
    $response = array('success' => true);
    $db = new Database();
    $speciesId = $_REQUEST['species'];

    $answers = array();
    if (isset($_REQUEST['new_answers'])) {
        $newQuestions = $_REQUEST['new_answers'];
        foreach ($newQuestions as $newQuestion => $newAnswer) {
            $questionId = $db->getQuestionId(strtolower(trim($newQuestion)));
            $answerId = $db->getAnswerId(strtolower(trim($newAnswer)));
            $answers[$questionId] = $answerId;
        }
    }
    if (isset($_REQUEST['answers'])) {
        $answers = $answers + $_REQUEST['answers'];
    }
    
    $db->addAnswers($speciesId, $answers);
    
    echo json_encode($response, true);
} catch (Exception $ex) {
    error_log($ex);
    die(json_encode(array('success' => false, 'message' => 'Failed to save data')));
}
