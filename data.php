<?php

try {
    require_once('Database.class.php');

    $response = array('success' => true);
    $db = new Database();

    $speciesMap = $db->getSpecies();;
    $response['species'] = $speciesMap;
    $response['species_ids'] = array_keys($speciesMap);
    $speciesNameMap = $db->index($speciesMap, 'name');
    $response['species_name_map'] = $speciesNameMap;

    $questionMap = $db->getQuestions();
    $response['questions'] = $questionMap;
    $response['question_ids'] = array_keys($questionMap);
    $response['answers'] = $db->getAnswers();
    
    echo json_encode($response, true);
} catch (Exception $ex) {
    error_log($ex);
    die(json_encode(array('success' => false, 'message' => 'Failed to load data')));
}