const remote = require('electron').remote;
const opentype = remote.getGlobal('opentype');
const path = require('path');
const paper = require('paper');
// import 

// ********************************** //
// public variables                   //
// ********************************** //

let FONT;
let FONT_DEFAULT;
let FONT_FILE_NAME = 'fonts/SDGTM.ttf';
let CANVAS = document.getElementById('canvas');
let CTX = CANVAS.getContext("2d");
let GLYPH_SELECTION = ['','',''];
let GLYPH_TABLE_LIST = [];
paper.setup(CANVAS);


// ********************************** //
// HANGUL JAMO                        //
// ********************************** //
const CHO = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
        'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
        'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ],
    JUNG = [
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
        'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
        'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
        'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
        'ㅣ'
    ],
    JONG = [
        '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
        'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
        'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
        'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
        'ㅌ', 'ㅍ', 'ㅎ'
    ];


// ********************************** //
// DOM selections                     //
// ********************************** //

let $_indexButtons = document.querySelectorAll('.index-button');
let $_rightMenuBarAll = document.querySelectorAll('.menu-right .bar');
let $_redrawButton = document.querySelector('.redraw');


// ********************************** //
// left menu tab controls             //
// ********************************** //

/** 
 * adding Event Listener
 * @global
 * @function addEventListers
 * @param none
 * these will run onload()
*/

function addEventListers(){
    /* 
    to LEFT-MENU, glyph selection buttons, ADD functions --
    1. add to its own css class 'index-selected'
    2. add to GLYPH_SELECTION array (which projects RIGHT-MENU, glyph-table)
     */
    for (var idx = 0; 0 < $_indexButtons.length; idx++){
        // console.log(indexButtons[idx]);
        if(!$_indexButtons[idx]) break;
        $_indexButtons[idx].addEventListener('click', function(){
            // console.log('clicked');
            // console.log(this);
            // console.log(this.className+' to ->');
            var glyphChar = this.innerText;
            var glyphIndex = 0;
            console.log('parent : ' + this.parentElement.id);
            switch(this.parentElement.id){
                case 'first'  : 
                    glyphIndex = 0;
                    break;
                case 'second' : 
                    glyphIndex = 1;
                    break;
                case 'third'  : 
                    glyphIndex = 2;
                    break;
            }
            console.log('glyphChar : ' + glyphChar);
            console.log('glyphIndex : ' + glyphIndex);
            if(this.classList.contains('index-selected')){            
                this.classList.remove('index-selected');
                GLYPH_SELECTION[glyphIndex] = GLYPH_SELECTION[glyphIndex].replace(glyphChar, '');
                // console.log(glyphSelection[glyphIndex].search(glyphChar));
            }else{
                this.classList.add('index-selected');
                GLYPH_SELECTION[glyphIndex] += glyphChar;
            }
            console.log(GLYPH_SELECTION);
            // console.log(this.className);
            loadGlyphList();
        }, false)
    }
    /* 
    to RIGHT-MENU, .bar divs, ADD functions --
    1. add to its own css class 'index-selected'
    2. add to GLYPH_SELECTION array (which projects RIGHT-MENU, glyph-table)
     */
    for(i in $_rightMenuBarAll){
        if(typeof i != Number) break;
        $_rightMenuBarAll[i].addEventListener('click', function(){
            console.log('clicked bar');
            var next = this.nextElementSibling;
            while(next && !next.classList.contains('bar')){
                if(next.classList.contains('display-none')){
                    next.classList.remove('display-none');
                } else if (!next.classList.contains('display-none')){
                    next.classList.add('display-none');
                }
                next = next.nextElementSibling;
            }
        }, false);
    }
}



window.addEventListener("resize", function() {
    var parent = CANVAS.parentElement;
    console.log('resized')
    CANVAS.height = parent.offsetHeight;
    CANVAS.width = parent.offsetWidth;
    
    paper.project.layers[0].remove()
    drawGlyph(han);
    
    //resize everything
    var glyphInfoDiv = document.getElementById('glyph-info-menu');
    glyphInfoDiv.setAttribute('style','height:'+window.innerHeight-90);
})


$_redrawButton.addEventListener('click', function(){
    drawGlyph(han);
},false)


// ********************************** //
// right menu tab controls            //
// ********************************** //

let glyphTAB = document.getElementById('glyphs');
let fontinfoTAB = document.getElementById('fontinfo');
let fonttableTAB = document.getElementById('fonttable');
let glyphMenu = document.getElementById('glyph-menu');
let fontinfoMenu = document.getElementById('glyph-info-menu');
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
    var table = document.getElementById('glyph-info-table');
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

loadFont(FONT_FILE_NAME);
// renderText('한');
var han = FONT.charToGlyph('한');
loadGlyphTable(han);

function loadFont(fontFileName){
    FONT = opentype.loadSync(fontFileName);
    console.log('loaded ', FONT.names.fontFamily.en, FONT.names.fontFamily.ko);
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

//private functions
/**
 * Calculate Unicode Hangul Johap from Hangul Jamo Unicode 
 * @function johap
 * @public
 * @param  {Object} arrIn - array with 3 unicode number fo hangul Jamo(Number)
 * @returns decimal unicode number
 */
function johap(arrIn){
    var ret = 0;
    var index1 = arrIn[0]-12593;
    var index2 = arrIn[1]-12622;
    // var index3 = arrIn[2]-

    if(!arrIn.length === 3){
        console.log('Cannot Johap() ERR(Input is not Valid Check input array length)');
        return;
    }else {
        
    }
    return ret;
}

// returns array of possible 
loadGlyphList(GLYPH_SELECTION);
function loadGlyphList(arr){

    var chosungList = arr[0].split();
    var joongsungList = arr[1].split();
    var jongsungList = arr[2].split();

};

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
        var min = CANVAS.width>CANVAS.height ? CANVAS.height : CANVAS.width;
        var tempPoint = new paper.Point((p.x*min/1000), CANVAS.height*0.75-(p.y*min/1000))
        tempPoint.selected = true;
        tempPath.add(tempPoint);
    }
    loadGlyphTable(char);
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
    if (!FONT) return;
    previewCtx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    FONT.draw(previewCtx, char, 0, 32, 150, {
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