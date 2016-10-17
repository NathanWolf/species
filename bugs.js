var currentQuestions = [];
var currentSpecies = [];
var currentBug = {};

function start() {
    reset();
    nextQuestion();
}

function reset() {
    currentQuestions = questions.slice();
    currentSpecies = species.slice();
    currentBug = {};
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
        first();
    }
}

function first() {
    var mainDiv = $('#main');
    var askDiv = $('<div class="unknown"/>').text("I don't know about any bugs yet!");
    mainDiv.append(askDiv);

    var nameDiv = $('<div class="new-name"/>').text("What is the name of this bug?");
    mainDiv.append(nameDiv);
    
    var nameInput = $('<input id="name" size="50" placeholder="(Type Name Here)"/>');
    mainDiv.append(nameInput);
    nameInput.keypress(function(e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            saveBug();
        }
    })
    
    var submitButton = $('<button type="button"/>').text("Name My Bug").click(function() {
        saveBug(); 
    });
    var submitDiv = $('<div class="submit"/>');
    submitDiv.append(submitButton);
    mainDiv.append(submitDiv);
}

function saveBug() {
    var nameInput = $('#name');
    var bugName = nameInput.val();
    if (bugName.length < 2) {
        showAlert("Please enter a bug name");
        return;
    }
    $('body').addClass("loading");
    loadBug(bugName);
}

function loadBug(title) {
    var jqxhr = $.ajax({
        url: "wiki.php",
        dataType: 'json',
        data: {
            title: title
        }
    })
    .done(function(data) {
        if (!data.success) {
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
    currentBug = {
        name: title,
        wikiData: wikiData
    };
    currentBug.title = title;
    currentBug.wikiData = wikiData;
    
    var mainDiv = $('#main');
    mainDiv.empty();
    var speciesDiv = $('<div class="species"/>');
    var nameText = title;
    if (wikiData.hasOwnProperty('redirect')) {
        currentBug.name = wikiData['redirect'];
        currentBug.commonName = title;
        nameText = nameText + " (" + wikiData['redirect'] + ")";
    }
    var nameDiv = $('<div class="name"/>').text(nameText);
    var pickDiv = $('<div class="instructions"/>').text("Please choose an image:");
    var imageContainer = $('<div class="image-picker"/>');
    for (var i = 0; i < wikiData.images.length; i++) {
        var imageData = wikiData.images[i];
        var imageDiv = $('<div class="image"/>');
        var imageUrl = $('<img src="' + imageData.url + '" title="' + imageData.title +'"/>');
        imageDiv.append(imageUrl);
        imageContainer.append(imageDiv);
        imageDiv.click(function(imageData) {
             return function() {
                 $('.image').removeClass('selected');
                 $(this).addClass('selected');
                 currentBug.image = imageData;
             }
        }(imageData));
    }
    var submitButton = $('<button type="button"/>').text("Save My Bug").click(function() {
        saveNewBug();
    });
    var submitDiv = $('<div class="submit"/>');
    submitDiv.append(submitButton);
    
    speciesDiv.append(nameDiv);
    speciesDiv.append(pickDiv);
    speciesDiv.append(imageContainer);
    speciesDiv.append(submitDiv);
    mainDiv.append(speciesDiv);
}

function saveNewBug() {
    alert("TODO");
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