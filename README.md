# Javascript-Quiz Project
Richard Ay, August 2020

## Table of Contents
* [Project Objective](#project-objective)
* [Acceptance Criteria](#acceptance-criteria)
* [Deployment Link](#deployment-link)
* [Quiz Logic](#quiz-logic)
* [Application Screen Shot](#application-screen-shot)


## Project Objective
As a coding boot camp student, I want to take  timed quiz on JavaScript fundamentals so that I can gauge my progress compared to my peers.  The quiz utility should store high scores in the browser's local storage.

## Acceptance Criteria
Given I am taking a (JavaScript) code quiz:

1) WHEN I click the start button, THEN a timer starts and I am presented with a question.
2) WHEN I answer a question, THEN I am presented with another question.
3) WHEN I answer a question incorrectly, THEN time is subtracted from the clock.
4) WHEN all questions are answered or the timer reaches 0, THEN the game is over.
5) WHEN the game is over, THEN I can save my initials and score.

## Deployment Link
The deployment link to display the updated web page is: 
https://captainrich.github.io/Javascript-Quiz/


## Quiz Logic
1) The initial page is displayed, with a button to start the quiz and an empty area for the quiz questions.
2) If applicable, the current quiz high scorer and score are obtained from the browser's local storage and displayed.
3) Quiz questions are displayed in the allocated area:
* The quiz question text is obtained from an array of objects
* The quiz answers are assembled in a loop and added to the question text.
* The combined text is displayed in the quiz area, waiting for a user response.
4) The user should enter the number of the correct answer and click [Check Answer]
5) Upon evaluating the answer, either "Correct" or "Wrong is displayed with an adjusted score.
* Correct answers increase the score by 2
* Incorrect answers decrease the score by 1 AND decrease the time remaining by 5 seconds
6) Quiz questions are continuously displayed until either:
* All questions have been displayed and answered, or
* Time runs out (allowed time starts at 30 seconds
7) If the final score exceeds the high score saved on browser storage, the user is prompted for his/her initials to replace the score saved (in the browsers storage).

The cursor is positioned to the "answer" field, and any prior value is blanked as each new question is displayed.


## Application Screen Shot

![Quiz Image](https://github.com/CaptainRich/Javascript-Quiz/blob/master/screenshot.jpg)

