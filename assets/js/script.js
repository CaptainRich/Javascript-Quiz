
// Define the button variable for later use. 

// Define the variable for the event listener for the start button. 
var quizEl = document.querySelector( "#quiz-page" );

// Define the variable for the event listener for the (form) answer response.
var formEl = document.querySelector( "#process-answer");

// Define the variable for the actual quiz box area
var newQuizQuestion = document.querySelector( "#quiz-question" );

// Define the variable to hold the quiz response instruction form area, and the user's answer
var quizResponse = "<input type='text' name='userSelection' class='quiz-box' placeholder='Enter answer number' />";
var userAnswer = 0;
var numValidAnswers = 0;              // tracks the number of valid answers for the current question


// Define a variables to be used to monitor the user's score. */
var quizScore = 0;

// Define the length of permitted time for the quiz
var timeLeft = 30;

// Define the variables used to update the HTML DOM. 
var timerValue = document.querySelector( "#timer");    // timer value 
var priorHigh  = document.querySelector("#prior");     // previous high score data
var answer     = document.querySelector("#goodbad");   // answer status (correct/incorrect)
var currScore  = document.querySelector("#score");     // current quiz score



// Define a variable for the main page so an event listener for the action buttons can be implemented.
var pageContentEl = document.querySelector( "#page-content" );


// Define the object that will hold the high scorer's initials and score.
var highScore = {
    initials: "",
    score: 0
};  

// Define an array of quiz objects.  Each object will contain:
//   - the quiz statement
//   - an array of possible answers
//   - the correct answer (1 based)r

// Note: Some of these questions have been obtained from the Internet

var quizData = [ 
    { question: "Q1: a += 1 is the same as a++?<br><br>",
      possibleAnswers:  [ "1) Yes<br>", "2) No<br>" ],
      solution: "1"},

     { question: "Q2: With the ++ loop operator, when is i++ incremented?<br><br>",
       possibleAnswers:  [ "1) Before 'i' is used in the loop.<br>",
                           "2) After the first use of 'i' in the loop.<br>",
                           "3) After all uses of 'i' in the loop.<br>",
                           "4) Just before 'i' is evaluated in the 'for' statement.<br>"],
      solution: "4"},

    { question: "Q3: The external JavaScript file must containt the '<script>' tag?<br><br>",
      possibleAnswers: [ "1) True<br>", "2) False<br>" ],
      solution: "2"},

    { question: "Q4: Is JavaScript case sensitive?<br><br>",
      possibleAnswers: [ "1) Yes<br>", "2) No<br>" ],
      solution: "1"},

    { question: "Q5: Where is the corect place to insert a JavaScript?<br><br>",
      possibleAnswers:  [ "1) The <body> section<br>", 
                          "2) The <head> section<br>",
                          "3) Both 1 and 2<br>"],
      solution: "3"},

      { question: "Q6: The JavaScript expresson: x = 8 + '8' returns what?<br><br>",
      possibleAnswers:  [ "1) 16<br>", 
                          "2) 88<br>",
                          "3) An error<br>",
                          "4) None of the above<br>"],
      solution: "2"} ,   

      { question: "Q7: Given: var str='abcdefg', charAt(4) returns?<br><br>",
      possibleAnswers:  [ "1) e<br>", 
                          "2) d<br>",
                          "3) An error<br>",
                          "4) None of the above<br>"],
      solution: "1"}    
    
];


///////////////////////////////////////////////////////////////////////////////////
// Define the function to save all the tasks to 'localStorage'
var saveScores = function() {

    // When pushing to 'localStorage' (which converts everything to a string), use a JSON converstion 
    // so we can have a visual of what got stored.
    localStorage.setItem( "highScore", JSON.stringify(highScore) );
 
}


// /////////////////////////////////////////////////////////////////////////////////// 
// Define the function to load all the tasks from 'localStorage'
var loadScores = function() {

    // Get the tasks from local storage
    var storedHighScore = localStorage.getItem( "highScore" );

    if( storedHighScore === null ) {
        highScore.initials = "NA";
        highScore.score    = 0;
        return highScore;             // nothing in browsers local storage
    }
 
    // Convert the score info from stringified format back into an array of objects
    highScore = JSON.parse( storedHighScore );
    return highScore;   
    
}
// ///////////////////////////////////////////////////////////////////////////////////  
//Define the controller function 
var quizHandler = function( event ) {

    // event.preventDefault();                 // prevent the browser from reloading the page. 
   

    // Load any existing "high score" information from
    // local storage and display it on the page.
    highScore = loadScores();
    priorHigh.textContent = "Prior High Score: " + highScore.initials + ", " + highScore.score;
    


    //quizTime();                                // start the timer

    // Display the first question and invoke the response form handler.


    // Loop over the quiz questions and display them in the quiz box. This continues 
    // until either all the quesions are answered or the timer expires.

    for( var i = 0; i < quizData.length; i++ ) {

        // As long as there is time left, put up the next quiz question
        if( timeLeft <= 0 ) {
            break;                // out of time, exit the loop
        }

        // Put the quiz question in the box.
        console.log( "about to show question ", i );
        var userAnswer = showQuestion( quizData[i] );

        // Wait for the button handler to give us an answer
        while( userAnswer === 0 ) {
            // Just wait for "userAnswer" to be set to a valid value > 0
        }

        // When the user picks an answer, check if it is correct and
        // adjsut the scoring accordingly (+2 for correct, -1 for incorrect).
        if( userAnswer === parseInt(quizData[i].solution) ) {
            // User answer is correct, increase score
            quizScore += 2;

            // Display answer status to the user
            answer.innerHTML = "Result: Correct";         
        }
        else {
            // User answer is incorrect, decrease score
            quizScore -= 1;
            
            // Display answer status to the user
            answer.innerHTML = "Result: Wrong";
            
        }
        currScore.textContent = "Score: " + quizScore;

    }


   // If the user's score is positive, determine if we can save it.
    if( highScore.score >= quizScore ){
        alert( "Sorry, you don't have the highest score." );
    }
    else {
        var userInitials = prompt ( "Enter your initials to save your score: " );
        if( userInitials === null ) {
            return;
        }

        // Take the first two characters and set the object for local storage.
        highScore.initials = userInitials.slice(0,2);
        highScore.score    = quizScore;

        saveScores();

    }

}


// ///////////////////////////////////////////////////////////////////////////////////  
// Define the function to display the quiz question and obtain the answer
var showQuestion = function( quizQuestion ) {
    var userAnswer = 0;

    // Obtain the question text
    var questionText = quizQuestion.question;

    // Build the queston text
    numValidAnswers = quizQuestion.possibleAnswers.length;
    for( var i = 0; i < numValidAnswers; i++ ) {
        questionText += quizQuestion.possibleAnswers[i];
    }
    
    // Add the quiz question
    newQuizQuestion.innerHTML = "<p>" + questionText + "</p>";

}


// ///////////////////////////////////////////////////////////////////////////////////  
// Define the handler for the "user respose button" [Check Answer]
var questionHandler = function(  ) {

    var ans  = document.getElementById("user-answer").value;
    var ians = parseInt( ans );

    if( ians > 0 && ians <= numValidAnswers ) {
        userAnswer = ians;
        valid      = true;
    }
    else {
        userAnswer = 0;
    }

}

// ///////////////////////////////////////////////////////////////////////////////////  
// Define the countdown timer function
var quizTime = function() {
    

    var x = setInterval( function() {
        if( timeLeft > 0 ) {
            timerValue.textContent = "Time Left: " + --timeLeft;
        }
        else {
            clearInterval( x );
            timerValue.textContent = "Quiz Over";
        }
    }, 1000 );
}


// /////////////////////////////////////////////////////////////////////////////////// 
// Setup the event handler when the quiz button is clicked.  The handler wukk
// start the timer and kick off the quiz questions. 

quizEl.addEventListener( "click", quizHandler );


// Setup the input form handler, for the user's question response.
formEl.addEventListener( "submit", questionHandler );
