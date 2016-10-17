var currentQuestions = [];
var currentSpecies = [];

function start() {
    reset();
    nextQuestion();
}

function reset() {
    currentQuestions = questions.slice();
    currentSpecies = species.slice();
}

function nextQuestion() {
    var mainDiv = $('#main');
    mainDiv.empty();
    if (currentQuestions.length == 0 || currentSpecies.length <= 1) {
        done();
        return;
    }
    var questionIndex = Math.floor(Math.random() * currentQuestions.length);
    var question = currentQuestions[questionIndex];
    currentQuestions.splice(questionIndex, 1);
    var questionSpan = $('<div class="question"/>').text(question.question);
    mainDiv.append(questionSpan);
    for (var i = 0; i < answers.length; i++) {
        var answer = answers[i];
        var answerSpan = $('<div class="answer"/>').text(answer.answer);
        answerSpan.click(function(answerId) {
            return function() {answerQuestion(question.id, answerId)};
        }(answer.id));
        $('#main').append(answerSpan);
    }
}

function answerQuestion(questionId, answerId) {
    var oldSpecies = currentSpecies;
    currentSpecies = [];
    for (var i = 0; i < oldSpecies.length;i++) {
        var species = oldSpecies[i];
        if (species.questions.hasOwnProperty(questionId) && species.questions[questionId] == answerId) {
            currentSpecies.push(species);
        }
    }
    nextQuestion();
}

function done() {
    if (currentSpecies.length == 1) {
        var speciesDiv = $('<div class="species"/>');
        var nameDiv = $('<div class="name"/>').text(currentSpecies[0].name);
        speciesDiv.append(nameDiv);
        $('#main').append(speciesDiv);
    } else {
        alert("no more questions!");
    }
}