const remote = require('electron').remote;
const opentype = remote.getGlobal('opentype');
const path = require('path');
const paper = require('paper');

// ********************************** //
// public variables                   //
// ********************************** //

let font;
let fontFileName = 'fonts/SDGTM.ttf';
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
paper.setup(canvas);

// ********************************** //
// left menu tab controls             //
// ********************************** //

var indexButtons = document.querySelectorAll('.index-button');
for (var idx = 0; 0 < indexButtons.length; idx++){
    console.log(indexButtons[idx]);
    if(!indexButtons[idx]) break;
	indexButtons[idx].addEventListener('click', function(){
        console.log('clicked');
        console.log(this);
        console.log(this.className+' to ->');
        if(this.classList.contains('index-selected')){
            this.classList.remove('index-selected');
        }else{
            this.classList.add('index-selected');
        }
        console.log(this.className);
	}, false)
}

window.addEventListener("resize", function() {
    var parent = canvas.parentElement;
    console.log('resized')
    canvas.height = parent.offsetHeight;
    canvas.width = parent.offsetWidth;
    // paper.project.view.update();
    paper.project.layers[0].remove()
    drawGlyph(han);
    // canvas.height = 
})

var redrawButton = document.querySelector('.redraw');
redrawButton.addEventListener('click', function(){
    drawGlyph(han);
},false)


// ********************************** //
// right menu tab controls            //
// ********************************** //

let glyphTAB = document.getElementById('glyphs');
let fontinfoTAB = document.getElementById('fontinfo');
let fonttableTAB = document.getElementById('fonttable');
let glyphMenu = document.getElementById('glyph-menu');
let fontinfoMenu = document.getElementById('info-menu');
let fonttableMenu = document.getElementById('table-menu');

// let rightMenuTabs = document.querySelectorAll('.menu-selection div');
    // for(var i = 0; i < rightMenuTabs.length; i++){
    //     console.log('adding event listener!')
    //     rightMenuTabs[i].addEventListener('click', clickTab, false);
    // }

    // function clickTab(){
    //     console.log('selected!')

    //     rightMenuTabs[index].classList.add('selected');
    //     document.querySelector('.menu-right').children[index+1].classList.remove('display-none');
    // }
    // function unclickTAB(){
    //     for(var i = 0; i < rightMenuTabs.length; i++){
    //         rightMenuTabs[i].classList.remove('selected');
    //         document.querySelector('.menu-right').children[i+1].classList.add('display-none');
    //     }
    // }


let clickTAB1 = function (){
    glyphTAB.classList.add('selected');
    fontinfoTAB.classList.remove('selected');
    fonttableTAB.classList.remove('selected');
    glyphMenu.classList.remove('display-none');
    fontinfoMenu.classList.add('display-none');
    fonttableMenu.classList.add('display-none');
};
let clickTAB2 = function (){
    fontinfoTAB.classList.add('selected');
    glyphTAB.classList.remove('selected');
    fonttableTAB.classList.remove('selected');
    fontinfoMenu.classList.remove('display-none');
    glyphMenu.classList.add('display-none');
    fonttableMenu.classList.add('display-none');
};
let clickTAB3 = function (){
    fonttableTAB.classList.add('selected');
    glyphTAB.classList.remove('selected');
    fontinfoTAB.classList.remove('selected');
    fonttableMenu.classList.remove('display-none');
    glyphMenu.classList.add('display-none');
    fontinfoMenu.classList.add('display-none');
};
glyphTAB.addEventListener("click", clickTAB1, false);
fontinfoTAB.addEventListener("click", clickTAB2, false);
fonttableTAB.addEventListener("click", clickTAB3, false);

function loadGlyphTable(char){
    var table = document.getElementById('glyph-table');
    table.innerHTML = '<tr><th>type</th><th>x</th><th>y</th></tr>'
    var tablehtml = '';
    for(i in char.path.commands){
        var point = char.path.commands[i];
        tablehtml += '<tr><td>' + point.type + '</td>';
        tablehtml += '<td>' + Math.round(point.x) + '</td>';
        tablehtml += '<td>' + Math.round(point.y) + '</td></tr>';
    }
    table.innerHTML += tablehtml;
}

// ********************************** //
// Loading default fonts              //
// ********************************** //

loadFont(fontFileName);
// renderText('한');
var han = font.charToGlyph('한');
loadGlyphTable(han);

function loadFont(fontFileName){
    font = opentype.loadSync(fontFileName);
    console.log('loaded ', font.names.fontFamily.en, font.names.fontFamily.ko);
    // listAll(font.names);
}

function loadNew(fontFileName){
    window.fontFileName = fontFileName;
    loadFont(fontFileName);
}

function listAll(o){
    if(typeof o === 'object'){
        for(each in o){
            listAll(o[each]);
        }
    } else {
        console.log(o)
    }
}


// ********************************** //
// drawing glyphs                     //
// ********************************** //
drawGlyph(han);
function drawGlyph(char){
    console.log('drawing init')
    var tempPath = new paper.Path({
        strokeColor: 'black'
      });
    var points = char.path.commands;
    for(idx in points){
        var p = points[idx];
        if(p.type !== 'M' && p.type !== 'Z')
        console.log('drawing',p.x, p.y);
        var min = canvas.width>canvas.height ? canvas.height : canvas.width;
        var tempPoint = new paper.Point((p.x*min/1000), canvas.height*0.75-(p.y*min/1000))
        tempPoint.selected = true;
        tempPath.add(tempPoint);
    }
}

// enableHighDPICanvas(canvas);

function enableHighDPICanvas(canvas) {
    if (typeof canvas === 'string') {
        canvas = document.getElementById(canvas);
    }
    var pixelRatio = window.devicePixelRatio || 1;
    if (pixelRatio === 1) return;
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    canvas.width = oldWidth * pixelRatio;
    canvas.height = oldHeight * pixelRatio;
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    canvas.getContext('2d').scale(pixelRatio, pixelRatio);
}

function renderText(char) {
    if (!font) return;
    previewCtx.clearRect(0, 0, canvas.width, canvas.height);
    font.draw(previewCtx, char, 0, 32, 150, {
        kerning: true,
        features: {
            liga: true,
            rlig: true
        }
    });
}






// document.getElementById('load-default').addEventListener('click', function(){
//     loadFont(fontFileName);
// });





// function onReadFile(e) {
//     // document.getElementById('font-name').innerHTML = '';
//     var temp = e.target.files[0];
//     var reader = new FileReader();
//     reader.onload = function(e) {
//         try {
//             console.log('try');
//             var font = opentype.parse(e.target.result);
//             onFontLoaded(font);
//             // showErrorMessage('');
//         } catch (err) {
//             console.log('catch');
//             // showErrorMessage(err.toString());
//             if (err.stack) console.log(err.stack);
//         throw(err);
//         console.log('throw');
//         }
//     };
//     reader.onerror = function(err) {
//         showErrorMessage(err.toString());
//     };
//     reader.readAsArrayBuffer(temp);
// }

// function onFontLoaded(font) {
//     window.font = font;
//     // renderText();
//     // displayFontData();
// }

// var fileButton = document.getElementById('file');
// fileButton.addEventListener('change', onReadFile, false);

//index selection toggle
// var indexButtons = document.querySelectorAll('.index-button')
// indexButtons.addEventListener('mousedown', ()=>{
//     console.log('clicked');
//     this.classList.add('index-selected');
// }, false);
// document.querySelectorAll('.index-selected').addEventListener('click', ()=>{
//     console.log('clicked');
//     this.classList.remove('index-selected');
// }, false);
//add Listeners to Left menu tabs


// glyphTAB.onclick = function(){
//     console.log('glyphTAB clicked');
// }
// glyphTAB.addEventListener("click", )