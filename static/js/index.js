$(document).ready(function() {
  var marks = [];
  var lines = [];
  var rectangles = [];
  var totalMarks = 0;
  var isFinishedDrawing = false;
  var currentShape = "poly";
  var rectCoordinate = {};
  var clickFlag = true;
  var id = 0;
  var currentImageId = "img1";
  var drawing = {};
  var x, y;

  

  const resetArtboard = function () {
    var artboard = document.getElementById("artboard-svg");
    marks = [];
    lines = [];
    rectangles = [];
    artboard.innerHTML = "";
    totalMarks = 0;
    removeMouseMoveListener();
  }

  function selectBottle(img) {
   resetArtboard();
   var data = {};
    var bgImage = document.getElementById("target-image");
    currentImageId = img.id;
    marks = [];
    lines = [];
    rectangles = [];
    bgImage.style.backgroundImage = "url(" + img.src + ")";

    $.ajax({
      url: "getImageDimension/" + currentImageId + "/",
      method: "GET",
      type: "json",
      success: function(result) {
        if (result) {
           loadDrawings(wrapper(result));
        } else {
          console.log("failed", currentImageId);
        }
      }
    });
  };

  var wrapper = function(obj) {
    var finalArray = [];
    var rectangles = obj.box;
    var lines = obj.polyLines;
    console.log(lines, rectangles)
    finalArray.push({ rectangles, lines });

    return finalArray;
  };

  var loadDrawings = function(drawingArray) {
    drawingArray.forEach(element => {
      if(element.rectangles != null) {
        element.rectangles.forEach(rectangle => {
          drawRectangle(rectangle);
        });
        rectangles = element.rectangles;
      }
      if(element.lines != null) {
        element.lines.forEach(line => {
          line.forEach(l => {
            drawLineAtMark(l);
          });
          lines = element.lines;
        });
      }

      totalMarks += element.lines && element.lines.length || 0;
      totalMarks += element.rectangles && element.rectangles.length || 0;
    });
  };

  document.getElementById("poly").style.backgroundColor = "#ffcccc";

  function shapeSelector(obj, shape) {
    removeMouseMoveListener();
    currentShape = shape;
    if (obj.id == "rect") {
      document.getElementById("rect").style.backgroundColor = "#ffcccc";
      document.getElementById("poly").style.backgroundColor = "#fff";
    } else if (obj.id == "poly") {
      document.getElementById("rect").style.backgroundColor = "#fff";
      document.getElementById("poly").style.backgroundColor = "#ffcccc";
    }
  };

  var drawOnMouseMove = function(event) {
    var artboard = document.getElementById("artboard-svg");
    var lastMark = Object.assign({}, marks[marks.length - 1]);
    var layerX = event.layerX;
    var layerY = event.layerY;

    if (currentShape == "poly") {
      drawLineAtMark({
        fromX: lastMark.fromX,
        fromY: lastMark.fromY,
        toX: layerX,
        toY: layerY
      });
    } else if (currentShape == "rect") {
        x = rectCoordinate.x;
        y = rectCoordinate.y;
        var width = layerX - rectCoordinate.x;
        var height = layerY - rectCoordinate.y;

        var lx = layerX;
        var ly = layerY;

        if (width < 0 && height < 0) {
          x = lx;
          y = ly;
        }
        if(width < 0) {
          x = lx;
        }
        if(height < 0){
          y = ly;
        }
        rectCoordinate = Object.assign({}, rectangles[rectangles.length - 1], {
          width: width,
          height: height,
        })

        drawRectangle({
          x: x,
          y: y,
          width: Math.abs(width),
          height: Math.abs(height),
        })
    }

    console.log('===========', lines.length, totalMarks, artboard.childElementCount);
    if (!lines.length || totalMarks <= artboard.childElementCount) {
      // delete most recent svg line
      removeRecentLine();
    }
  };

  var removeMouseMoveListener = function() {
    document
      .getElementById("artboard-svg")
      .removeEventListener("mousemove", drawOnMouseMove);
  };

  var reset = function() {
    resetArtboard();
    $.ajax({
      url: "resetImageDimension/" + currentImageId + "/",
      method: "GET",
      type: "json",
      success: function(result) {
        if (result.status == 200) {
          console.log("success");
        } else {
          console.log("failed");
        }
      }
    });
  };


  var removeRecentLine = function(isFinishing) {
    var artboard = document.getElementById("artboard-svg");
    setTimeout(() => {
      if (artboard.childElementCount > 1) {
        artboard.removeChild(
          artboard.children[artboard.childElementCount - (isFinishing ? 1 : 2)],
          1
        );
      }
    }, 0);
  };

  var finishCurrentDrawing = function() {
    if (!isFinishedDrawing) {
      removeMouseMoveListener();
      removeRecentLine(true);
      isFinishedDrawing = true;
      marks.splice(marks.length - 1, 1);
      lines.push(Object.assign([], marks));
      marks = [];
    }
  };
  var drawRectangle = function(rectObject) {
    var artboard = document.getElementById("artboard-svg");
    var rect = document.createElement("rect");

    rect.setAttribute("x", rectObject.x);
    rect.setAttribute("y", rectObject.y);
    rect.setAttribute("width", rectObject.width);
    rect.setAttribute("height", rectObject.height);
    rect.setAttribute(
      "style",
      "stroke:black;stroke-width:2;fill-opacity:0;stroke-opacity:1"
    );

    artboard.appendChild(rect);

    // SVG don't rerender dynamically added elements, so had to do this work around.
    artboard.innerHTML = artboard.innerHTML;
    // afterDrawFinish();
  };

  var drawLineAtMark = function(mark) {
    var artboard = document.getElementById("artboard-svg");

    var newLine = document.createElement("line");
    newLine.setAttribute("x1", mark.fromX);
    newLine.setAttribute("y1", mark.fromY);
    newLine.setAttribute("x2", mark.toX);
    newLine.setAttribute("y2", mark.toY);
    newLine.setAttribute("style", "stroke:rgb(255,0,0);stroke-width:2");

    artboard.appendChild(newLine);

    // SVG don't rerender dynamically added elements, so had to do this work around.
    artboard.innerHTML = artboard.innerHTML;
    // afterDrawFinish();
  };

  var startOrMarkNewPoint = function(event) {
    var layerX = event.layerX;
    var layerY = event.layerY;
    totalMarks += 1;

    document
      .getElementById("artboard-svg")
      .addEventListener("mousemove", drawOnMouseMove);

    if (currentShape == "poly") {
      if (!marks.length) {
        isFinishedDrawing = false;
        marks.push({
          fromX: layerX,
          fromY: layerY
        });

        
      } else {
        var previousMark = marks[marks.length - 1];
        marks[marks.length - 1] = Object.assign({}, previousMark, {
          toX: layerX,
          toY: layerY
        });

        marks[marks.length] = {
          fromX: layerX,
          fromY: layerY
        };
        previousMark = marks[marks.length - 2];

        drawLineAtMark(previousMark);
      }
    } else if (currentShape == "rect") {
      if (clickFlag) {
        rectangles.push({
          x: layerX,
          y: layerY
        });
        clickFlag = false;
       
      } else {
        rectangles[rectangles.length - 1] = Object.assign(
          {},
          {
            x, y,
          },
          {
            width: Math.abs(rectCoordinate.width),
            height: Math.abs(rectCoordinate.height)
          }
        );
        drawRectangle(rectangles[rectangles.length - 1]);
        rectCoordinate = {};
        clickFlag = true;
        removeMouseMoveListener();
      }
    }
  };

  var save = function() {
    if (!isFinishedDrawing) {
      finishCurrentDrawing();
    }

    drawing.imageId = currentImageId;
    drawing.lines = lines;
    drawing.rectangles = rectangles;

    $.ajax({
      url: "setImageDimension",
      method: "GET",
      data: {
        drawings: JSON.stringify(drawing)
      },
      type: "json",
      success: function(result) {
        if (result.status == 200) {
          console.log("success");
        } else {
          console.log("failed");
        }
      }
    });
    
    drawing = {};
  };

  window.onload = selectBottle(document.getElementById('img1'))

  document
    .getElementById("artboard-svg")
    .addEventListener("click", startOrMarkNewPoint);

  document.getElementById("btn-save").addEventListener("click", save);

  document.getElementById("btn-reset").addEventListener("click", reset);

  document.getElementById("rect").addEventListener("click", function(event) {
    shapeSelector(this, "rect");
  });

  document.getElementById("poly").addEventListener("click", function() {
    shapeSelector(this, "poly");
  });

  for (var i = 1; i <= 5; i++) {
    document.getElementById("img" + i).addEventListener("click", function() {
      selectBottle(this);
    });
  }

});


