<?php
class Database
{
    private $db;
    private $protocol = 'mysql';
    private $server = 'localhost';
    private $database = 'bugs';
    private $user = 'bugs';
    private $password = 'bugs';
    private $options = PDO::FETCH_ASSOC;

    private $species = null;
    private $answers = null;
    private $questions = null;
    
    public function connect()
    {
        if (!$this->db) {
            $connection = $this->protocol . ':host=' . $this->server . ';dbname=' . $this->database . ';charset=utf8';
            $this->db = new PDO($connection, $this->user, $this->password);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return $this->db;
    }

    function index(&$data, $id = 'id')
    {
        $results = array();
        foreach ($data as &$record)
        {
            $recordId = $record[$id];
            $results[$recordId] = $record;
        }
        return $results;
    }
    
    public function getSpecies()
    {
        if (is_null($this->species)) {
            $db = $this->connect();
            $fetchSpecies = $db->prepare('SELECT * FROM species');
            $fetchSpecies->execute();
            $species = $fetchSpecies->fetchAll($this->options);
            $this->species = $this->index($species);

            $fetchQuestionAnswers = $db->prepare('SELECT * FROM question_answer');
            $fetchQuestionAnswers->execute();
            $questionAnswers = $fetchQuestionAnswers->fetchAll($this->options);
            
            foreach ($questionAnswers as $questionAnswer) {
                $species = &$this->species[$questionAnswer['species_id']];
                if (!isset($species['questions'])) {
                    $species['questions'] = array();
                }
                $species['questions'][$questionAnswer['question_id']] = $questionAnswer['answer_id'];
            }
        }
        
        return $this->species;
    }

    public function getAnswers()
    {
        if (is_null($this->answers)) {
            $db = $this->connect();
            $fetchAnswers = $db->prepare('SELECT * FROM answer');
            $fetchAnswers->execute();
            $answers = $fetchAnswers->fetchAll($this->options);
            $this->answers = $this->index($answers);
        }

        return $this->answers;
    }

    public function getQuestions()
    {
        if (is_null($this->questions)) {
            $db = $this->connect();
            $fetchQuestions = $db->prepare('SELECT * FROM question');
            $fetchQuestions->execute();
            $questions = $fetchQuestions->fetchAll($this->options);
            $this->questions = $this->index($questions);
        }

        return $this->questions;
    }
}