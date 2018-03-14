const paper = require('paper');
const {Path, Point} = require('paper');
const opentype = require('opentype.js')
// const font = require('./node_modules/opentype.js/src/font.js');
// const opentype = require('./lib/dist/opentype.js');
// console.log(opentype);
console.log(paper);
console.log(this);
console.log(opentype);

var canvas = document.getElementById('myCanvas');

paper.setup(canvas);
