<?php

try {
    require_once('Database.class.php');

    $response = array('success' => true);
    $db = new Database();

    $response['speciesMap'] = $db->getSpecies();
    $response['species'] = array_values($response['speciesMap']);

    $response['questionMap'] = $db->getQuestions();
    $response['questions'] = array_values($response['questionMap']);

    $answers = $db->getAnswers();
    ksort($answers);
    $response['answerMap'] = $answers;
    $response['answers'] = array_values($response['answerMap']);
    
    echo json_encode($response, true);
} catch (Exception $ex) {
    error_log($ex);
    die(json_encode(array('success' => false, 'message' => 'Failed to load data')));
}