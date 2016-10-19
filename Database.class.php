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
        $primaryIndex = ($id === 'id');
        $results = array();
        foreach ($data as &$record)
        {
            $recordId = $record[$id];
            $results[$recordId] = $primaryIndex ? $record : $record['id'];
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

            $fetchQuestionAnswers = $db->prepare('SELECT species_id, question_id, answer_id FROM question_answer');
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
            $fetchAnswers = $db->prepare('SELECT id, answer FROM answer');
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
            $fetchQuestions = $db->prepare('SELECT id, question FROM question');
            $fetchQuestions->execute();
            $questions = $fetchQuestions->fetchAll($this->options);
            $this->questions = $this->index($questions);

            $questionAnswers = $db->prepare('SELECT question_id, answer_id FROM question_answer group by question_id, answer_id');
            $questionAnswers->execute();
            $answers = $questionAnswers->fetchAll($this->options);
            
            foreach ($answers as $answer) {
                $question = &$this->questions[$answer['question_id']];
                if (!isset($question['answers'])) {
                    $question['answers'] = array();
                }
                array_push($question['answers'], $answer['answer_id']);
            }
        }

        return $this->questions;
    }
    
    public function getQuestionId($question)
    {
        // This is a bit hacky, but lets us send a mixed list from the client containing
        // question id's and (potentially) new questions to store.
        // We make the assumption that a simple number is not a valid questions
        // (Though it could be a valid answer, which is why we have a separate list of new answers)
        if (is_int($question)) return $question;
        
        $db = $this->connect();
        $db->beginTransaction();

        $fetchQuestion = $db->prepare('SELECT id FROM question WHERE question=:question');
        $fetchQuestion->bindParam('question', $question);
        $fetchQuestion->execute();
        $existing = $fetchQuestion->fetch($this->options);
        if ($existing) {
            $db->commit();
            return $existing['id'];
        }

        $sql = 'INSERT INTO question (question, created) VALUES (:question,UTC_TIMESTAMP())';
        $addQuestion = $db->prepare($sql);
        $addQuestion->bindParam('question', $question);
        $addQuestion->execute();
        $lastId = $db->lastInsertId();
        $db->commit();

        return $lastId;
    }

    public function getAnswerId($answer)
    {
        $db = $this->connect();
        $db->beginTransaction();

        $fetchAnswer = $db->prepare('SELECT id FROM answer WHERE answer=:answer');
        $fetchAnswer->bindParam('answer', $answer);
        $fetchAnswer->execute();
        $existing = $fetchAnswer->fetch($this->options);
        if ($existing) {
            $db->commit();
            return $existing['id'];
        }

        $sql = 'INSERT INTO answer (answer, created) VALUES (:answer,UTC_TIMESTAMP())';
        $addAnswer = $db->prepare($sql);
        $addAnswer->bindParam('answer', $answer);
        $addAnswer->execute();
        $lastId = $db->lastInsertId();
        $db->commit();

        return $lastId;
    }
    
    public function add($name, $commonName, $description, $imageUrl, $wikiUrl, $answers)
    {
        $db = $this->connect();
        $db->beginTransaction();

        $fetchExisting = $db->prepare('SELECT id FROM species WHERE name=:name');
        $fetchExisting->bindParam('name', $name);
        $fetchExisting->execute();
        $existing = $fetchExisting->fetch($this->options);
        $speciesId = $existing ? $existing['id'] : null;
        if (!$speciesId) {
            $sql = 'INSERT INTO species (name, created, common_name, image_url, wiki_url, description) VALUES (:name, UTC_TIMESTAMP(), :common, :image, :wiki, :description)';
            $addAnswer = $db->prepare($sql);
            $addAnswer->bindParam('name', $name);
            $addAnswer->bindParam('common', $commonName);
            $addAnswer->bindParam('description', $description);
            $addAnswer->bindParam('image', $imageUrl);
            $addAnswer->bindParam('wiki', $wikiUrl);
            $addAnswer->execute();
            $speciesId = $db->lastInsertId();
        }
        
        $this->addAnswers($speciesId, $answers);
        
        $db->commit();
        
        return $speciesId;
    }
    
    public function addAnswers($speciesId, $answers) {
        $db = $this->connect();
        foreach ($answers as $questionId => $answerId) {
            $sql = 'INSERT INTO question_answer (species_id, question_id, answer_id, created) VALUES (:species, :question, :answer, UTC_TIMESTAMP())';
            $addAnswer = $db->prepare($sql);
            $addAnswer->bindParam('species', $speciesId);
            $addAnswer->bindParam('question', $questionId);
            $addAnswer->bindParam('answer', $answerId);
            $addAnswer->execute();
        }
    }
}