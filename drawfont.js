const {ipcRenderer} = require('electron');
// const paper = require('paper');
// const {Path, Point} = require('paper');
// window.fontkit = require('fontkit');
// var opentype = require('opentype.js');
var ot;
ipcRenderer.on('init-opentype', function(event, opentype){
    console.log(opentype);
    console.log(opentype.Font);
})
console.log(ot);
