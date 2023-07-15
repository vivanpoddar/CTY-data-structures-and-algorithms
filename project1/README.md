# Project 1

This project start the creation of a Drawing Utility.  The main page is located in *drawer.html* which you can load into a browser.  This project separated into two parts. The first part requires that you learn how to **read** Javascript and the seconds asks you two **write** Javascript.

### Application Usage
1. Building a Line:
   1. Left Click on a location on the screen.
   2. Left Clicking on the Last Point created ends building a line
2. Moving/Add Points after a line is built:
   1. Left Click on a **black** dot and drag to the desired location
   2. Left Click on a **blue** dot to insert a point at that location
3. Removing a Point after a line is built:
   1. Hold down the Left Shift key
   2. Left Click on a black point
   
## Part 1
Read all JavaScript files, the *drawer.html* and *drawer.css*.  Comment all sections of code use the JavaScript or HTML/CSS block comment.  Proper comments should summarize JavaScript code, not replace it.

For example, line 2 of *linetool.js*:
Poor Comment: "Creates a variables named POINT_RADIUS and assigned it the value 20"
Good Comment: "Specifies the radius of graphical points"

Sometimes, comments should be for entire sections of code and not just one line.  For example, line 37-44 of *linetool.js* can be described in one comment, because the code is a response to **one** question.

## Part 2
In this portion of the project, you will create a Singly-Linked List and have the *LineTool* use it instead of the JavaScript array.


1. Create a new file called *LinkedList.js*.  Dont forget to modify *drawer.html* at the script tags to include the file!
2. Within the file, create two classes:
   * *LinkedList* - describes an optimized singly-linked list
   * *LinkedNode* - describes a node for a singly-linked list

3. Replace the line 7 of *linetool.js* with:

`this.points = new LinkedList()`

4. Correctly implement all methods needed by the *LineTool* class to store points:

---

`push(item)` - Adds *item* to the end of the list.

---

`splice(index, numToDelete, itemToAdd)` - Adds *itemToAdd* to the LinkedList at *index* after removing *numDelete* items.

For example, splice(1, 3, 5) removes 3 items after index 1 then inserts a 5.

---

[] is used to *access* elements in the  list, so you'll need to create a *get* method and a *set* method.  You'll also need to modify the code in *linetool.js*.

Google: JavaScript getters setters

--- 

length is also accessed, so you'll need to make a *get* method for it.  

---

**Iterators** - for/of loops use an iterator to move sequentially through an object.  To create an iterator:

`[Symbol.iterator]` which returns the correct object.

 Google: JavaScript Iterators