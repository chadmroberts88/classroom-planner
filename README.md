# Classroom Planner

## View Deployment:

https://chadmroberts88.github.io/classroom-planner/

## Description:

Classroom Planner is a web application aimed at assisting teachers with planning classroom layouts and organizing student seating. This project uses the browser’s local storage to save the user’s session, so they can come back and finish their plan at a later time.

## Motivation:

This project was developed after receiving a suggestion from a teacher who had to often change classrooms. The current tool she was using was a part of a larger SIS (School Information System) which had limited features and was not user-friendly. I developed this alternative in response to her suggestion.

## Outcome:

Classroom Planner served primarily to develop skills in JavaScript while continuing to improve on writing HTML and CSS. By adding a number of functionalities related to manipulating classroom objects, as well as creating and sorting the student list, I was able to make use of a wide range of JavaScript features and methods.

## Features:

Users can easily add objects to the classroom canvas, and layer, move, and rotate them as needed. The length and width of the classroom canvas can also be adjusted to accommodate classrooms of all sizes.

Once a classroom layout has been constructed, users can populate the student list with the names of the students in their class. The student list can be sorted in alphabetical or reverse alphabetical order. From the list, students can be assigned to a desk. The name of a student will appear above their assigned desk when display names have been toggled on.

If a user wishes to finish their classroom plan at a later time, they can save their session to local storage. There are also options to print both the classroom layout and the student list.

## Technologies Used:

- [JavaScript](https://www.javascript.com/)
- [Font Awesome](https://fontawesome.com/)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

## Run on a Local Machine:

1. Open a terminal window in the directory where you want to clone this project, then type:

   `git clone https://github.com/chadmroberts88/classroom-planner.git`

2. Navigate into the "classroom-planner" directory:

   `cd classroom-planner`

3. Install the required dependencies:

   `npm install`

4. Run the project:

   `npm start`

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
