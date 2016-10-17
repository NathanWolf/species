<?php
try {
    require_once('Database.class.php');
    $db = new Database();
    $species = array_values($db->getSpecies());
    $questions = array_values($db->getQuestions());
    $answers = $db->getAnswers();
    ksort($answers);
    $answers = array_values($answers);
} catch (Exception $ex) {
    error_log($ex);
    die('Sorry, something went wrong!');
}
?>
<html>
    <head>
        <title>Aurora's Bug-O-Pedia</title>
        <script type="text/javascript" src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
        <script type="text/javascript" src="http://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
        <script type="text/javascript" src="bugs.js"></script>

        <link rel="stylesheet" href="http://code.jquery.com/ui/1.12.1/themes/cupertino/jquery-ui.css"/>
        <link rel="stylesheet" href="bugs.css"/>
        
        <script type="text/javascript">
            var species = <?= json_encode($species, JSON_NUMERIC_CHECK); ?>;
            var questions = <?= json_encode($questions, JSON_NUMERIC_CHECK); ?>;
            var answers = <?= json_encode($answers, JSON_NUMERIC_CHECK); ?>;
            
            $(document).ready(function() {
                start();
            });
        </script>
    </head>
    <body>
        <h1>Aurora's Bug-O-Pedia</h1>
        <div id="main"></div>
        <div class="modal"/>
    </body>
</html>
