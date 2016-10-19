// Database data, should not be changed except when refreshing
var database = null;

// Tracking data
var currentQuestions = [];
var currentSpecies = [];
var currentAnswers = {};
var newAnswers = {};
var currentBug = {};

function start() {
    reset();
    fetchData(nextQuestion);
}

function reset() {
    $('#main').empty();
    database = null;
    currentQuestions = [];
    currentSpecies = [];
    currentBug = {};
    currentAnswers = {};
    newAnswers = {};
}

function fetchData(callback) {
    $('body').addClass("loading");
    $.ajax({
        url: "data.php",
        dataType: 'json'
    })
    .done(function(data) {
        if (!data || !data.success) {
            showRetry("Error loading data from database, sorry!", data.message);
        } else {
            setDatabase(data);
            callback();
        }
    })
    .fail(function() {
        showRetry("Error loading data from database, sorry!", 'Communications Failure');
    })
    .always(function() {
        $('body').removeClass("loading");
    });
}

function showRetry(message, title) {
    var mainDiv = $('#main');
    mainDiv.empty();
    mainDiv.append($('<div class="retryInstructions"/>').text(message).prop('title', title));
    var retryButton = $('<button type="button"/>').text("Try Again").click(function() {
        start();
    });
    var retryDiv = $('<div class="submitLarge"/>');
    retryDiv.append(retryButton);
    mainDiv.append(retryDiv);
}

function showStartOver(message) {
    var mainDiv = $('#main');
    mainDiv.empty();
    mainDiv.append($('<div class="retryInstructions"/>').text(message));
    var retryButton = $('<button type="button"/>').text("Start Over").click(function() {
        start();
    });
    var retryDiv = $('<div class="submitLarge"/>');
    retryDiv.append(retryButton);
    mainDiv.append(retryDiv);
}

function setDatabase(data) {
    database = data;
    currentQuestions = database.questions.slice();
    currentSpecies = database.species.slice();
}

function nextQuestion() {
    var mainDiv = $('#main');
    mainDiv.empty();
    if (currentQuestions.length == 0 || currentSpecies.length <= 1) {
        foundMatch();
        return;
    }
    
    var instructionsSpan = $('<div class="instructions large"/>').text("Let's answer some questions so I can learn about your bug! I may be able to guess what you have.");
    mainDiv.append(instructionsSpan);
    
    var questionIndex = Math.floor(Math.random() * currentQuestions.length);
    var question = currentQuestions[questionIndex];
    currentQuestions.splice(questionIndex, 1);
    
    // This should never happen, but you know.
    if (!question.hasOwnProperty('answers')) {
        nextQuestion();
        return;
    } 
    
    var questionSpan = $('<div class="question"/>').text(question.question);
    mainDiv.append(questionSpan);
    var remainingAnswers = jQuery.extend({}, database.answers);
    for (var i = 0; i < question.answers.length; i++) {
        var answer = database.answers[question.answers[i]];
        delete remainingAnswers[question.answers[i]];
        var answerSpan = $('<div class="answer"/>').text(answer.answer);
        answerSpan.click(function(answerId) {
            return function() { answerQuestion(question.id, answerId); };
        }(answer.id));
        mainDiv.append(answerSpan);
    }
    var customAnswers = [];
    for (var key in remainingAnswers) {
        if (remainingAnswers.hasOwnProperty(key)) {
            customAnswers.push(remainingAnswers[key].answer);
        }
    }
    var customAnswerSpan = $('<div class="answer"/>');
    var answerInput = $('<input id="newAnswer" type="text" size="30" placeholder="(Other Answer)"/>')
        .autocomplete({source: customAnswers})
        .keypress(function(e) {
            if (e.keyCode == $.ui.keyCode.ENTER) {
                newAnswer(question.id, $('#newAnswer').val());
            }
        });
    var answerButton = $('<button type="button"/>').text("Answer").click(function() {
        newAnswer(question.id, $('#newAnswer').val());
    });
    customAnswerSpan.append(answerInput);
    customAnswerSpan.append(answerButton);
    mainDiv.append(customAnswerSpan);
}

function newAnswer(questionId, answer) {
    if (answer.length < 2) {
        showAlert('Please enter an answer');
        return;
    }
    if (answer.length > 255) {
        showAlert('That answer is too long, please shorten it');
        return;
    }
    var oldSpecies = currentSpecies;
    currentSpecies = [];
    for (var i = 0; i < oldSpecies.length;i++) {
        var species = oldSpecies[i];
        if (!species.questions.hasOwnProperty(questionId)) {
            currentSpecies.push(species);
        }
    }
    newAnswers[questionId] = answer;
    nextQuestion();
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
    currentAnswers[questionId] = answerId;
    nextQuestion();
}

function foundMatch() {
    if (currentSpecies.length > 0) {
        var species = currentSpecies[0];
        var speciesDiv = $('<div class="species"/>');
        var speciesName = species.name;
        if (species.common_name) {
            speciesName = species.common_name + ' (' + speciesName + ')';
        }
        var nameDiv = $('<div class="name"/>').text(speciesName);
        speciesDiv.append(nameDiv);
        
        if (species.image_url) {
            var imageLink = $('<a href="' + species.image_url + '" target="_new"/>');
            var imageDiv = $('<div class="thumbnail"/>');
            imageLink.append($('<img src="' + species.image_url + '"/>'));
            imageDiv.append(imageLink);
            speciesDiv.append(imageDiv);
        }
        if (species.wiki_url) {
            var wikiDiv = $('<div class="wikiLink"/>').append($('<a href="' + species.wiki_url + '" target="_new"/>').text("Full Wikipedia Article"));
            speciesDiv.append(wikiDiv);
        }
        if (species.description) {
            var descriptionDiv = $('<div class="extract description"/>').html(species.description);
            speciesDiv.append(descriptionDiv);
        }
        
        var askContainer = $('<div class="ask"/>');
        var askDiv = $('<div class="instructions"/>').text("Is this your bug?");
        askContainer.append(askDiv);

        var yesButton = $('<button type="button"/>').text("Yes").click(function() {
            askContainer.empty();
            var startOverDiv = $('<div class="instructions"/>').text("Hooray!");
            askContainer.append(startOverDiv);
            
            var startOverButton = $('<button type="button"/>').text("Start Over").click(function() {
                start();
            });
            askContainer.append(startOverButton);
        });
        var noButton = $('<button type="button"/>').text("No").click(function() {
            noMoreQuestions();
        });
        askContainer.append(yesButton);
        askContainer.append(noButton);
        speciesDiv.append(askContainer);
        
        $('#main').append(speciesDiv);
    } else {
        noMoreQuestions();
    }
}

function noMoreQuestions() {
    var mainDiv = $('#main');
    mainDiv.empty();
    var introMessage = database.questions.length == 0 ? "I don't know anything yet! Can you help me learn?" : "I've run out of questions! Can you help me learn?";
    var askDiv = $('<div class="unknown"/>').text(introMessage);
    mainDiv.append(askDiv);

    var nameDiv = $('<div class="newName"/>').text("What is the name of your bug?");
    mainDiv.append(nameDiv);
    
    var nameInput = $('<input id="name" size="50" placeholder="(Type Name Here)"/>');
    mainDiv.append(nameInput);
    nameInput.keypress(function(e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            nameBug();
        }
    });
    
    var submitButton = $('<button type="button"/>').text("Name My Bug").click(function() {
        nameBug(); 
    });
    var submitDiv = $('<div class="submit"/>');
    submitDiv.append(submitButton);
    mainDiv.append(submitDiv);
    appendFactSection(mainDiv);
}

function appendFactSection(mainDiv)
{
    var answerCount = 0;
    var answers = {};
    for (var currentAnswerKey in currentAnswers) {
        if (currentAnswers.hasOwnProperty(currentAnswerKey)) {
            answerCount++;
            answers[database.question_map[currentAnswerKey].question] = database.answers[currentAnswers[currentAnswerKey]].answer;
        }
    }
    for (var newAnswerKey in newAnswers) {
        if (newAnswers.hasOwnProperty(newAnswerKey)) {
            answerCount++;
            answers[database.question_map[newAnswerKey].question] = newAnswers[newAnswerKey];
        }
    }
    if (answerCount > 0) {
        var plural = answerCount > 1 ? 's' : '';
        var factsLabel = $('<div class="instructions"/>').text(numberToWord(answerCount) + ' fact' + plural + ' about your bug:');
        var factsTable = $('<table class="facts"/>');
        for (var question in answers) {
            if (answers.hasOwnProperty(question)) {
                var factsRow = $('<tr/>');
                var questionCell = $('<td/>').text(question);
                var answerCell = $('<td/>').text(answers[question]);
                factsRow.append(questionCell);
                factsRow.append(answerCell);
                factsTable.append(factsRow);
            }
        }
        mainDiv.append(factsLabel);
        mainDiv.append(factsTable);
    }
}

function numberToWord(number) {
    switch (number) {
        case 0: return 'Zero';
        case 1: return 'One';
        case 2: return 'Two';
        case 3: return 'Three';
        case 4: return 'Four';
        case 5: return 'Five';
        case 6: return 'Six';
        case 7: return 'Seven';
        case 8: return 'Eight';
        case 9: return 'Nine';
        case 10: return 'Ten';
        case 11: return 'Eleven';
        case 12: return 'Twelve';
        case 13: return 'Thirteen';
        case 14: return 'Fourteen';
        case 15: return 'Fifteen';
    }
    return number;
}

function nameBug() {
    var nameInput = $('#name');
    var bugName = nameInput.val();
    if (bugName.length < 2) {
        showAlert("Please enter a bug name");
        return;
    }
    if (bugName.length > 255) {
        showAlert("Please enter a shorter bug name");
        return;
    }
    loadBug(bugName);
}

function loadBug(title) {
    $('body').addClass("loading");
    $.ajax({
        url: "wiki.php",
        dataType: 'json',
        data: {
            title: title
        }
    })
    .done(function(data) {
        if (!data || !data.success) {
            showAlert("Error loading wiki data - can't save bug, sorry! (" + data.message + ")");
        } else {
            showNewBug(title, data);
        }
    })
    .fail(function() {
        showAlert("Error loading wiki data - can't save bug, sorry!");
    })
    .always(function() {
        $('body').removeClass("loading");
    });
}

function showNewBug(title, wikiData) {
    var currentBug = {
        name: title,
        commonName: null,
        description: null,
        image: null,
        wikiUrl: null
    };
    
    var mainDiv = $('#main');
    mainDiv.empty();
    var speciesDiv = $('<div class="species"/>');
    var nameText = title;
    if (wikiData.hasOwnProperty('redirect')) {
        currentBug.name = wikiData['redirect'];
        currentBug.commonName = title;
        nameText = nameText + " (" + wikiData['redirect'] + ")";
    }
    if (wikiData.hasOwnProperty('wiki')) {
        currentBug.wikiUrl = 'https://en.wikipedia.org/wiki/' + wikiData['wiki'];
    }
    var nameDiv = $('<div class="name"/>').text(nameText);
    speciesDiv.append(nameDiv);
    
    if (wikiData.hasOwnProperty('extract')) {
        var extractDiv = $('<div class="extract"/>');
        extractDiv.html(wikiData['extract']);
        speciesDiv.append(extractDiv);
        currentBug.description = wikiData['extract'];
    }
    
    var pickImageDiv = $('<div class="instructions"/>').text("Please choose an image:");
    speciesDiv.append(pickImageDiv);
    
    var imageContainer = $('<div class="image-picker"/>');
    for (var i = 0; i < wikiData.images.length; i++) {
        var imageData = wikiData.images[i];
        var imageDiv = $('<div class="image"/>');
        var imageUrl = $('<img src="' + imageData.url + '" title="' + imageData.title +'"/>');
        imageDiv.append(imageUrl);
        imageContainer.append(imageDiv);
        imageDiv.click(function(url) {
             return function() {
                 $('.image').removeClass('selected');
                 $(this).addClass('selected');
                 currentBug.image = url;
             }
        }(imageData.url));
    }
    speciesDiv.append(imageContainer);
    
    var pickQuestionDiv = $('<div class="instructions"/>').text("Please type a question to help me identify this bug:");
    speciesDiv.append(pickQuestionDiv);
    if (currentBug.wikiUrl != null) {
        var wikiDiv = $('<div class="wikiLink"/>').append($('<a href="' + currentBug.wikiUrl + '" target="_new"/>').text("Full Wikipedia Article"));
        speciesDiv.append(wikiDiv);
    }
    var questionDiv = $('<div class="newQuestion"/>');
    var questionLabel = $('<label for="newQuestion"/>').text("Question:");
    var questionInput = $('<input id="newQuestion" size="150" placeholder="(Type a Question)"/>');
    questionDiv.append(questionLabel).append(questionInput);
    speciesDiv.append(questionDiv);
    var answerDiv = $('<div class="newAnswer"/>');
    var answerLabel = $('<label for="newAnswer"/>').text("Answer:");
    var answerInput = $('<input id="newAnswer" size="50" placeholder="(Type an Answer)"/>');
    var allAnswers = [];
    for (var key in database.answers) {
        if (database.answers.hasOwnProperty(key)) {
            allAnswers.push(database.answers[key].answer);
        }
    }
    answerInput.autocomplete({source: allAnswers});
    
    answerDiv.append(answerLabel).append(answerInput);
    speciesDiv.append(answerDiv);

    appendFactSection(speciesDiv);
    
    var submitButton = $('<button type="button"/>').text("Save My Bug").click(function() {
        saveNewBug(currentBug);
    });
    var submitDiv = $('<div class="submitLarge"/>');
    submitDiv.append(submitButton);
    speciesDiv.append(submitDiv);
    
    mainDiv.append(speciesDiv);
}

function saveNewBug(bug) {
    var question = $('#newQuestion').val();
    var answer = $('#newAnswer').val();
    if (question.length < 2 || answer.length < 1) {
        showAlert("Please enter a question and answer so I can identify this bug");
        return;
    }
    if (question.length > 255) {
        showAlert("Please enter a shorter question");
        return;
    }
    if (answer.length > 255) {
        showAlert("Please enter a shorter answer");
        return;
    }
    newAnswers[question] = answer;
    $('body').addClass("loading");
    $.ajax({
        url: "add.php",
        dataType: 'json',
        type: 'POST',
        data: {
            name: bug.name,
            description: bug.description,
            common_name: bug.commonName,
            new_answers: newAnswers,
            answers: currentAnswers,
            image_url: bug.image,
            wiki_url: bug.wikiUrl
        }
    })
    .done(function(data) {
        if (!data || !data.success) {
            showAlert("Error saving bug, sorry! (" + data.message + ")");
        } else {
            showStartOver("Thank you, I've learned a little bit about " + bug.name + "!");
        }
    })
    .fail(function() {
        showAlert("Error saving bug, sorry!");
    })
    .always(function() {
        $('body').removeClass("loading");
    });
}

function showAlert(message, icon, title) {
    title = title ? title : 'Bug-O-Pedia';
    icon = icon ? icon : 'alert';

    var alertDiv = jQuery('<div title="' + title + '"/>')
        .append(jQuery('<span class="ui-icon ui-icon-' + icon + '" style="float: left; margin: 0 7px 20px 0;"/>'))
        .append(jQuery('<span/>').append(message));

    alertDiv.dialog
    ({
        resizable: false,
        modal: true,
        buttons : { "Ok" : function() { jQuery(this).dialog("close"); } }
    });
}