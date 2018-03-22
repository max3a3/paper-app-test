const remote = require('electron').remote;
const opentype = remote.getGlobal('opentype');
const path = require('path');
const paper = require('paper');

let FONT;
let FONT_DEFAULT;
let FONT_FILE_NAME = 'fonts/SDGTM.ttf';

let CANVAS = document.getElementById('canvas');
let CTX = CANVAS.getContext("2d");

FONT = opentype.loadSync(FONT_FILE_NAME);

var char = String.fromCharCode(GLYPH_TABLE_LIST[index]);

canvas.setAttribute('id', ('UNI'+GLYPH_TABLE_LIST[index]));
var w = canvas.offsetWidth
var h = canvas.offsetHeight

var ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

ctx.fillStyle = '#AAA';
ctx.font = '9px "Open Sans"';
ctx.fillText(char, 2, canvas.offsetHeight - 2);
var glyph = FONT.charToGlyph(char),
    glyphWidth = glyph.advanceWidth * 0.01,
    xmin = (w - glyphWidth) / 2,
    xmax = (w + glyphWidth) / 2,
    x0 = xmin;
    maxHeight = F_HEAD.yMax - F_HEAD.yMin;
    fontBaseline = h * F_HEAD.yMax / maxHeight;
    fontScale = Math.min(w / (F_HEAD.xMax - F_HEAD.xMin), h / maxHeight)
    fontSize = fontScale * FONT.unitsPerEm;
ctx.fillStyle = '#FFFFFF';

// var path = glyph.getPath(x0, fontBaseline, fontSize);
var temppath = glyph.getPath(x0, fontBaseline, fontSize);
// console.log(path);
// for(i in path.commands){
//     var temp = path.commands[i];
//     console.log(temp.type,temp.x,temp.y);
// }
temppath.fill = "#333";
console.log('drawing glyph'+char);
temppath.draw(ctx);