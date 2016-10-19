<?php

try {
    require_once('Database.class.php');

    $response = array('success' => true);
    $db = new Database();

    $speciesMap = $db->getSpecies();;
    $response['species'] = array_values($speciesMap);

    $questionMap = $db->getQuestions();
    $response['questions'] = array_values($questionMap);
    $response['question_map'] = $questionMap;
    $response['answers'] = $db->getAnswers();
    
    echo json_encode($response, true);
} catch (Exception $ex) {
    error_log($ex);
    die(json_encode(array('success' => false, 'message' => 'Failed to load data')));
}