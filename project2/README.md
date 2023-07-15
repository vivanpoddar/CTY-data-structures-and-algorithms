# Project 2

This project adds the ability to create multiple named drawing spaces.  We'd like to add the ability to sort the names in alphabetical order.

## Files Alterred or Added From Project 1
* *linkedlist.js* -- the linked list our LineTool uses (Project 1 Solution)
* *linetool.js* -- changed clientX to offsetX to account for side palette
* *drawingspace.js* -- moved code from *drawer.html* to allow for multiple spaces
* *bst.js* -- general framework for a Binary Search Tree
* *drawer.html* -- added GUI for multiple drawing spaces and sorting; Refactored code to allow for multiple drwing spaces
* *drawer.css* -- added styles for the spaces palette


## Application Usage
1. Building a Line:
   1. Left Click on a location on the screen.
   2. Left Clicking on the Last Point created ends building a line
2. Moving/Add Points after a line is built:
   1. Left Click on a **black** dot and drag to the desired location
   2. Left Click on a **blue** dot to insert a point at that location
3. Removing a Point after a line is built:
   1. Hold down the Left Shift key
   2. Left Click on a black point
4. Workspace Modifications:
   1. Add Workspace - Left Click the button with a plus
   2. Delete Active Workspace - Left Click the button with a circle
   3. Switch Workspaces - Left Click a non-green tab in the scrolling list
   4. Change Name of Workspace - Double Left Click a tab in the scrolling list
      1. Pressing enter accepts the name change
      2. Pressing escape or click out of the tab reverts to the old name
   5. Change Sort Order - Left Click the Sort Button
   
## Part 1
Read all JavaScript files, the *drawer.html* and *drawer.css*.  Comment all sections of code use the JavaScript or HTML/CSS block comment.  Proper comments should summarize JavaScript code, not replace it.  You might want to copy comments from Project 1 if they're similar.

## Part 2
In this portion of the project, you will create a Binary Search Tree so that the sorting functionality of workspaces is operational.  Sorting is done lexigraphically by the title of the Drawing Space.  The layout of the Binary Search Tree is done for you, so you only need to implement the methods in the *bst.js* file for the base project.