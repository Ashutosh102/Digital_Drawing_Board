/*************************************
Drawing Board
All code is in vanilla javascript
*************************************/

var can = document.querySelector(".canvas-main");           // variable for the canvas
var con = can.getContext('2d');                             // variable for the context
var eraserButton = document.querySelector('.eraser');       // variable for the eraser button
var clearButton = document.querySelector('.clear');         // variable for the clear button
var thickness = document.querySelector('.thick-choice');    // variable for the thickness drop down menu
var colorPick = document.querySelector('.color');           // variable for the color palette
var currentColor = '0%, 0%, 0%';                            // set black as default color
var currentThick = 1;                                       // set '1' as default thickness
var paint = false;                                          // a flag will be set true when left-button is held down; this will allow painting
var mouseX, mouseY;                                         // variables to store mouse coordinates
var coord = [];                                             // array to store all (x,y) coordinates

// When eraser button is clicked, enable "erase mode" by adding a CSS class
eraserButton.addEventListener('click', function() {
  eraserButton.classList.toggle('erase-on');
});

// When thickness is changed, store the new setting into "currentThick"
thickness.addEventListener('change', function() {
  currentThick = thickness.value;
});

// When clear button is pressed, clear the canvas & reset the coord array back to an empty array
clearButton.addEventListener('click', function() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  coord = [];
})

// When a color is chosen from the palette via "blur" event, store that color's RGB value into "currentColor"
colorPick.addEventListener('blur', function() {
  currentColor = colorPick.color.rgb[0] * 100 + '%, ' + colorPick.color.rgb[1] * 100 + '%, ' + colorPick.color.rgb[2] * 100 + '%'; 
});

// addClick is a function that saves all (x,y) mouse coordinates into the coord array.
function addClick(x, y, drag) {
    if ( eraserButton.classList.contains('erase-on')) {     // if we're in eraser mode, then marker color will be white
      coord.push({ X: x,                                    // each (x,y) is an object containing the x & y coordinates
                   Y: y, 
                   DRAG: drag,                              // boolean value for DRAG variable
                   COLOR: '100%, 100%, 100%',               // color value
                   THICK: 50                                // thickness value
               });
    }
    else {
      coord.push({ X: x,                                     // else, color uses currentColor
                   Y: y, 
                   DRAG: drag, 
                   COLOR: currentColor, 
                   THICK: currentThick
               });
    }
}

// redraw will clear the canvas and 
// it will cycle through the coord array, drawing mini-lines between each pair of 
// coordinates to represent what the user is drawing.
function redraw() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);       // clear canvas
      
  for(var i=0; i < coord.length; i++) {                           // iterate through "coord" array
    con.beginPath();
    
    if (coord[i].DRAG) {                                          // if DRAG is true, this means the current (x,y) isn't the start of a user-drawn line, 
       con.moveTo(coord[i-1].X, coord[i-1].Y);                    // it's in the middle somewhere as part of that line.  
    }                                                             // So the moveTo() method should start at the previous (x,y) in our array.
    else {
       con.moveTo(coord[i].X + 1, coord[i].Y + 1);                // else the current (x,y) is the start point for a user-drawn line.  
    }                                                             // Then the moveTo() should go to a neighboring point, this will cause the start point to appear
                                                                  // as a dot on our board.
    con.lineTo(coord[i].X, coord[i].Y);                           // lineTo() should do to the current (x,y) in our array
    con.closePath();              
    con.lineWidth = coord[i].THICK;                               // use the thickness set for that (x,y)
    con.strokeStyle = 'rgb(' + coord[i].COLOR + ')';              // use the color set for that (x,y)
    con.stroke();                                                 // draw this mini-line
  }
}

// event handler for when the left mouse button is held down, the user is drawing
can.addEventListener('mousedown', function(e) {
  mouseX = e.pageX - this.offsetLeft;                              // record the coordinates
  mouseY = e.pageY - this.offsetTop;

  paint = true;                                                    // set paint flag as true, because we want to draw on the board
  addClick(mouseX, mouseY, false);                                 // send coordinates to addClick().  False is for the DRAG boolean variable
  redraw();                                                        // to denote this (x,y) is the first point of a line drawn by user.
});


// event handler for when the user moves the mouse around
can.addEventListener('mousemove', function(e) {
  mouseX = e.pageX - this.offsetLeft;         
  mouseY = e.pageY - this.offsetTop;

  if (paint) {                                                      // record coordinates only if the paint flag is true, which is set true 
    addClick(mouseX, mouseY, true);                                 // when the left mouse button is held down.  Here DRAG is true, to tell 
    redraw();                                                       // the function that this (x,y) is part of the line rather than the start of it
  }
});

// event handler for when user lets go of the mouse button
can.addEventListener('mouseup', function(e) {
  paint = false;                                                    // set paint to false, we don't want to record these (x,y) coordinates
});

// event handler for when user moves mouse out of bounds of canvas
can.addEventListener('mouseleave', function(e) {                    
  paint = false;                                                    // set paint to false, we don't want to record these (x,y) coordinates
});
  