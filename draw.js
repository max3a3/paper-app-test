var paper = require('paper');
var canvas = document.getElementById('myCanvas');

console.log(paper);
paper.setup(canvas);
console.log(canvas);
var newpath = new paper.Path({
  strokeColor: 'black'
});
var p1 = new paper.Point(100,100);
var p2 = new paper.Point(200,200);
newpath.add(p1);
newpath.add(p2);
// newpath.moveTo(p1);
// newpath.lineTo(p2);
console.log(newpath);
console.log(p1);
console.log(p2);
canvas.on('click',function(){
  onMouseDown();
});
function onMouseDown(event){
  console.log('pressed!');
}

// canvas.offsetWidth = window.innerWidth;
// canvas.offsetHeight = window.innerHeight;
// canvas.setAttribute("width", window.innerWidth);
// canvas.setAttribute("height", window.innerHeight);

// var path = new paper.Path();
// path.add(new paper.Point(100, 100));
// path.add(new paper.Point(200, 200));
// paper.view.draw(path);
