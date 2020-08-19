
// Define the button variable for later use. 

// Define the variable for the event listener for the quiz form. 
var quizEl = document.querySelector( "#quiz-page" );


// Define a variables to be used to monitor the user's score. */
var quizScore = 0;

// Define the length of permitted time for the quiz
var timeLeft = 30;

// Define the timer value as a global variable
var timerValue = document.querySelector( "#timer");


// Define a variable for the main page so an event listener for the action buttons can be implemented.
var pageContentEl = document.querySelector( "#page-content" );


// Define the object that will hold the high scorer's initials and score.
var highScore = {
    initials: "",
    score: 0
};  

// Define an array of quiz objects.  Each object will contain:
//   - the quiz statement
//   - 1 first possible answer
//   - 2 second possible answer
//   - 3 third possible answer
//   - 4 fourth possible answer
//   - correct answer

var quizData = [ 
    { question: "Q1: a += 1 is the same as a++?",
      answer1:  "Yes",
      answer2:  "No",
      answer3:  "",
      answer4:  "",
      solution: "1"},

     { question: "Q2: With the ++ operator, when is i++ incremented?",
      answer1:  "Before the index 'i' is used in the loop.",
      answer2:  "After the first use of 'i' in the loop.",
      answer3:  "After all uses of 'i' in the loop.",
      answer4:  "Just before 'i' is evaluated in the 'for' statement.",
      solution: "4"}
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
//Define an anonymous function to create a new task item  
var quizHandler = function( event ) {

    // event.preventDefault();                 // prevent the browser from reloading the page. 
   

    // Load any existing "high score" information from
    // local storage and display it on the page.
    highScore = loadScores();
    document.querySelector("#prior").textContent = "Prior High Score: " + highScore.initials + ", " + highScore.score;
    


    quizTime();                                // start the timer

    // Loop over the quiz questions and display them in the quiz box. This continues 
    // until either all the quesions are answered or the timer expires.

    for( var i = 0; i < quizData.length; i++ ) {

        // As long as there is time left, put up the next quiz question
        if( timeLeft <= 0 ) {
            break;                // out of time, exit the loop
        }

        // Put the quiz question in the box.
        var userAnswer = 0;
        //var userAnswer = showQuestion( quizData[i] );

        // When the user picks an answer, check if it is correct and
        // adjsut the scoring accordingly (+2 for correct, -1 for incorrect).
        if( userAnswer === quizData[i].solution ) {
            // User answer is correct, increase score
            quizScore += 2;
        }
        else {
            // User answer is incorrect, decrease score
            quizScore -= 1;
        }

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
// Define the function to change the status of a task
var taskStatusChangeHandler = function( event ) {
    
    // Get the Id of the task item to be moved.
    var taskId = event.target.getAttribute("data-task-id");

    // Get the currently selected opition (the current status), and convert to lower case
    var statusValue = event.target.value.toLowerCase();

    // Find the parent task item element based on id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']" );

    // Based on the selected option, put the task in the corresponding column.

    if( statusValue === "to do") {
        tasksToDoEl.appendChild( taskSelected );
    }
    else if( statusValue === "in progress" ) {
        tasksInProgressEl.appendChild( taskSelected );
    }
    else if ( statusValue === "completed" ) {
        tasksCompletedEl.appendChild( taskSelected );

    }

    // Make sure the proper status is maintained in the 'tasks' array for proper persistence.
    for( var i = 0; i < tasks.length; i++ ) {
        if( tasks[i].id === parseInt(taskId) ) {
            tasks[i].status = statusValue;
         }
    }

    saveTasks();                           // save the current array of tasks objects to the browsers 'localStorage' area.
};

// ///////////////////////////////////////////////////////////////////////////////////  
// Define the function to create the HTML for a newly added task. 
var createTaskEl = function( taskDataObj ){

    var listItemEl = document.createElement( "li" );   // create the "li" item/selector. 
    listItemEl.className = "task-item";                // assign the proper class to this new item. 

    // Add a 'task-id' value as a custom attribute, so we know which task is which. 
    listItemEl.setAttribute("data-task-id", taskIdCounter );
    listItemEl.setAttribute("draggable", "true");      // also set this element to be draggable

    // Create a 'div' to hold the task info and add it to the list item just created. 
    var taskInfoEl = document.createElement( "div" );
    taskInfoEl.className = "task-info";                // give the 'div' a class name

    // Add content and style to this new 'div' element 
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    // Put things all together using .appendChild 
    listItemEl.appendChild( taskInfoEl );                    // this adds the 'h3' and 'span' data 
    var taskActionsEl = createTaskActions( taskIdCounter );  // create the action buttons
    listItemEl.appendChild( taskActionsEl );                 // add the buttons to the 'li'
    tasksToDoEl.appendChild( listItemEl );                   // add the new "li"  to its parent, the "ul" item    

    // Update the 'task object' with its task id value, then put the oject into the array.
    taskDataObj.id = taskIdCounter;
    tasks.push( taskDataObj );             // now push (put) this object into the array 'taskDataObj'
    saveTasks();                           // save the current array of tasks objects to the browsers 'localStorage' area.

    // Increment the 'task-id' value.
    taskIdCounter++; 
}

// ///////////////////////////////////////////////////////////////////////////////////  
// Define a function to dynamically create the task actions. 
var createTaskActions = function( taskId ) {

    // Create a 'div' element to hold the 'task action buttons'
    var actionContainerEl = document.createElement( "div" );
    actionContainerEl.className = "task-actions";

    // Now create the buttons.  First the 'Edit Task' button
    var editButtonEl =  document.createElement( "button" );
    editButtonEl.textContent = "Edit";                         // give the button text to display
    editButtonEl.className = "btn edit-btn";                   // give the button classes
    editButtonEl.setAttribute( "data-task-id", taskId );       // assign custom data to the button

    actionContainerEl.appendChild( editButtonEl );             // add the new HTML element to the 'div'
    
    // Now create the 'Delete Task' button.  
    var deleteButtonEl =  document.createElement( "button" );
    deleteButtonEl.textContent = "Delete";                     // give the button text to display
    deleteButtonEl.className = "btn delete-btn";               // give the button classes
    deleteButtonEl.setAttribute( "data-task-id", taskId );     // assign custom data to the button

    actionContainerEl.appendChild( deleteButtonEl );           // add the new HTML element to the 'div'}

    // Now add the selection list, to change the task status
    var statusSelectEl = document.createElement( "select" );
    statusSelectEl.className = "select-status";                // give the drop-list classes
    statusSelectEl.setAttribute( "name", "status-change" );
    statusSelectEl.setAttribute( "data-task-id", taskId );     // asign custom data to the list

    actionContainerEl.appendChild( statusSelectEl );           // add the new HTML element to the 'div'}

    // Define the options for the drop-list.
    var statusChoices = [ "To Do", "In Progress", "Completed" ];

    for( var i = 0; i < statusChoices.length; i++ ) {

        // Create the option element
        var statusOptionEl = document.createElement( "option" );
        statusOptionEl.textContent = statusChoices[i];         // assign the text to display
        statusOptionEl.setAttribute( "value", statusChoices[i] );

        statusSelectEl.appendChild( statusOptionEl );         // append to the drop list
    }

    return actionContainerEl;
}


// /////////////////////////////////////////////////////////////////////////////////// 
// Define the 'task button handler' function.
var taskButtonHandler = function( event ) {
  
    // Get the target element from the 'event'
    var targetEl = event.target;

    // Test to see which button was clicked.
    if( targetEl.matches( ".edit-btn")) {  // The 'edit' button was clicked.
        
        // Get the element's (the button's) task id
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if( targetEl.matches( ".delete-btn")) {  // The 'delete' button was clicked
        
        // Get the element's (the button's) task id
        var taskId = targetEl.getAttribute("data-task-id");

        // Delete the task with Id = 'taskId'
        taskDelete( taskId );
    };
};


// /////////////////////////////////////////////////////////////////////////////////// 
// Define the 'edit task' function.
var editTask = function( taskId ){
    
    // Find the task associated with 'taskId'
    var taskSelected = document.querySelector( ".task-item[data-task-id='" + taskId + "']" );

    // Get content from the task name and task type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    document.querySelector("input[name='task-name']").value = taskName;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("select[name='task-type']").value = taskType;

    // Change the button text from 'Edit' to 'Save Task'
    document.querySelector("#save-task").textContent = "Save Task";

    // Create a new attribute so we don't lose the 'taskId'
    formEl.setAttribute( "data-task-id", taskId );
 
}

// /////////////////////////////////////////////////////////////////////////////////// 
// Finish off the 'edit task' function.
var completeEditTask = function( taskName, taskType, taskId ) {
    
    // Need to find the matching "task list" item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']" );

    // Set the new (edited) values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // Update the 'tasks' array so proper persistence can be maintained.
    // Loop through the 'tasks' array looking for the proper Id.
    for( var i = 0; i < tasks.length; i++ ) {
        if( tasks[i].id === parseInt(taskId) ) {
            tasks[i].name = taskName;             // update the Name and Type for the matching task
            tasks[i].type = taskType;
        }
    }

    saveTasks();                           // save the current array of tasks objects to the browsers 'localStorage' area.


    alert( "Task has been updated!" );

    // Reset the form by removing the 'data-task-id' and putting the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

// /////////////////////////////////////////////////////////////////////////////////// 
// Define the 'delete task' function.
var taskDelete = function( taskId ) {

    // Find the task associated with 'taskId', and delete it.
    var taskSelected = document.querySelector( ".task-item[data-task-id='" + taskId + "']" );
    taskSelected.remove();

    // To maintain persistence, the deleted task must be removed from the 'tasks' array also.  Do this by
    // first creating a new array with the tasks we're going to keep.

    var updatedTaskArr = [];

    for( var i = 0; i < tasks.length; i++ ) {
        if( tasks[i].id !== parseInt(taskId) ) {
            // We want to keep this task, since its Id doesn't match the Id of the task being deleted.
            updatedTaskArr.push( tasks[i] ) ;
        }
    }

    // Finally reassign the 'tasks' array to be equal to the 'updatedTaskArr'.
    tasks = updatedTaskArr;
    saveTasks();                           // save the current array of tasks objects to the browsers 'localStorage' area.
}


// /////////////////////////////////////////////////////////////////////////////////// 
// Define the event handler function for the drag/drop operation
var dragTaskHandler = function( event ) {

    // Get the task Id for the event
    var taskId = event.target.getAttribute("data-task-id");
   
    // Store this Id in the "dataTransfer" property of the (drag) event object
    event.dataTransfer.setData("text/plain", taskId);      // format and value

    var getId = event.dataTransfer.getData("text/plain");
 }


// /////////////////////////////////////////////////////////////////////////////////// 
// Define the event handler function for the dropzone event.
var dropZoneDragHandler = function( event ) {

    // Determine if the dropzone is over a "task list", which is what we want
    var taskListEl = event.target.closest(".task-list");

    // Disable the default behavior preventing us dropping this object
    if( taskListEl ) {
        event.preventDefault();

        // Also, change the background style to indicate a valid drop zone area
        taskListEl.setAttribute( "style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;" );
        
    }

}


// /////////////////////////////////////////////////////////////////////////////////// 
// Define the event handler for the 'drag leave' event.
var dragLeaveHandler = function( event ) {

        // Determine if we are 'leaving' a "task list" zone, and if so remove the style
        var taskListEl = event.target.closest(".task-list");
        if( taskListEl ) {
            taskListEl.removeAttribute( "style" );
        }
}



// /////////////////////////////////////////////////////////////////////////////////// 
// Define the event handler function for the 'drop' event.
var dropTaskHandler = function( event ) {

    // Get the drop target's id
    var id = event.dataTransfer.getData( "text/plain" );

    // Get the id of the 'dragged' task item.
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");

    // Get the dropzone where our task was dropped.
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;

    // Set the status of our task based on the new dropzone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    
    if( statusType === "tasks-to-do" )  {
        statusSelectEl.selectedIndex = 0;
    }
    else if( statusType === "tasks-in-progress" ){
        statusSelectEl.selectedIndex = 1;
    }
    else if( statusType === "tasks-completed" ){
        statusSelectEl.selectedIndex = 2;
    }

    // Append the dropped task to its new parent list.
    dropZoneEl.appendChild( draggableElement );

    // Remove the "valid drop zone" style added in the 'dropZoneDragHandler'
    dropZoneEl.removeAttribute( "style" );

    // Also need to update the tasks status in the 'tasks' array to maintain persistence
    for( var i = 0; i < tasks.length; i++ ) {
        if( tasks[i].id === parseInt(id) ) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }

    saveTasks();                           // save the current array of tasks objects to the browsers 'localStorage' area.
}


// /////////////////////////////////////////////////////////////////////////////////// 




// /////////////////////////////////////////////////////////////////////////////////// 
// Setup the (form) event handler and call-back function .  When the quiz button is clicked the handler 
// start the timer and kick off the quiz questions. 
// The "submit" event is invoked when a button with 'type=submit' is clicked, or the user presses '[Enter]'. 
quizEl.addEventListener( "click", quizHandler );

