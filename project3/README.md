# Project 3

This project adds the ability to save and load drawing spaces from files.  Your addition is to add Huffman compression and decompression to those files.

## Files Alterred or Added From Project 2
* *bst.js* -- the Binary Search Tree (Solution)
* *linetool.js* -- added toJSON and fromJSON methods for serialization
* *drawingspace.js* -- add toJSON and fromJSON method for serialization; added name attribute for spaces
* *drawer.html* -- added GUI for saving and loading text files
* *drawer.css* -- added styles for the file loading


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
4. File Input/Output
   1. Save file - Left click the button with a down arrow
   2. Load file - Left click the button with an up arrow. Workspaces are added to those that already exist.
5. Workspace Modifications:
   1. Add Workspace - Left Click the button with a plus
   2. Delete Active Workspace - Left Click the button with a circle
   3. Switch Workspaces - Left Click a non-green tab in the scrolling list
   4. Change Name of Workspace - Double Left Click a tab in the scrolling list
      1. Pressing enter accepts the name change
      2. Pressing escape or click out of the tab reverts to the old name
   
## Part 1
Read all JavaScript files, the *drawer.html* and *drawer.css*.  You will only alter the *saveFile* method of *drawer.html* and *compress* function in the *huffman.js* file.

1. Create your heap **and** Huffman compression in the *huffman.js* file.
2. When the save button is clicked, output to the console **only** the Huffman Table for the save file.

**Note:** I have provided suggested functions for your algorithm.  Feel free to edit or modify anything inside the *compress* and *decompress* functions.

## Part 2 (May Get Removed)
In this portion, you'll completely compress the text file to binary and implement decompression.

1. Use bitwise operators and byte arrays to compress the text into one bye array.  Be sure to encode the Huffman Tree in the data.
2. Implement the decompress function to take a completed Huffman compression and return the completed text.