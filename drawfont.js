/**
 * Product of ONE MORE WAY
 * (c) Moum app
 * http://slainger.me v0.0.1 | (c) Min Seong Kim a.k.a.SalingerMS
 * Any Copy Prohibited
 * Uses opentype.js by Frederik De Bleser and other contributors
 *      Paper.js by Juerg Lehni & Jonathan Puckey
 */

// ********************************** //
// MADATORY IMPORTS                   //
// ********************************** //
const remote = require('electron').remote;
const opentype = remote.getGlobal('opentype');
const path = require('path');
const paper = require('paper');


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
let CHAR_TO_DRAW = '한'

// ********************************** //
// SETUP FOR APP                      //
// ********************************** //
paper.setup(CANVAS);

loadFont(FONT_FILE_NAME);

let F_HEAD = FONT.tables.head;
let GLYPH_TO_DRAW = FONT.charToGlyph(CHAR_TO_DRAW);

loadGlyphInfo(GLYPH_TO_DRAW);

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
let $_redrawButton = document.querySelector('.redraw');

let $_rightMenuBarAll = document.querySelectorAll('.menu-right .bar');

let $_glyphTAB = document.getElementById('glyphs');
let $_fontinfoTAB = document.getElementById('fontinfo');
let $_fonttableTAB = document.getElementById('fonttable');
let $_glyphMenu = document.getElementById('glyph-menu');
let $_fontinfoMenu = document.getElementById('glyph-info-menu');
let $_fonttableMenu = document.getElementById('table-menu');

let $_glyphDiv = document.getElementById('glyph-menu');
let $_glyphInfoDiv = document.getElementById('glyph-info-menu');
let $_tableDiv = document.getElementById('table-menu');

let $_allCanvas = document.querySelectorAll('#glyph_list .glyph-list canvas');


// ********************************** //
// left menu tab controls             //
// ********************************** //

addEventListers();

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
            // @TODO
            toGlyphList(GLYPH_SELECTION);
            drawThumbNail();
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
    drawGlyph(GLYPH_TO_DRAW);
    
    //resize everything
    $_tableDiv.setAttribute('style', 'height:'+(window.innerHeight-90)+'px');
    $_glyphInfoDiv.setAttribute('style', 'height:'+(window.innerHeight-90)+'px');
    $_glyphDiv.setAttribute('style', 'height:'+(window.innerHeight-90)+'px');

})

$_redrawButton.addEventListener('click', function(){
    drawGlyph(GLYPH_TO_DRAW);
},false)

let searchInput = document.querySelector("input.search")
    searchInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        console.log(this.value);
        this.blur();
        GLYPH_TABLE_LIST = this.value;
        //LOAD GLYPH TABLE
        this.value = '';
    }
});

// ********************************** //
// right menu tab controls            //
// ********************************** //

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
    $_glyphTAB.classList.add('selected');
    $_fontinfoTAB.classList.remove('selected');
    $_fonttableTAB.classList.remove('selected');
    $_glyphMenu.classList.remove('display-none');
    $_fontinfoMenu.classList.add('display-none');
    $_fonttableMenu.classList.add('display-none');
    $_tableDiv.setAttribute('style', 'height:'+(window.innerHeight-90)+'px');
};
let clickTAB2 = function (){
    $_fontinfoTAB.classList.add('selected');
    $_glyphTAB.classList.remove('selected');
    $_fonttableTAB.classList.remove('selected');
    $_fontinfoMenu.classList.remove('display-none');
    $_glyphMenu.classList.add('display-none');
    $_fonttableMenu.classList.add('display-none');
    $_glyphInfoDiv.setAttribute('style', 'height:'+(window.innerHeight-90)+'px');
};
let clickTAB3 = function (){
    $_fonttableTAB.classList.add('selected');
    $_glyphTAB.classList.remove('selected');
    $_fontinfoTAB.classList.remove('selected');
    $_fonttableMenu.classList.remove('display-none');
    $_glyphMenu.classList.add('display-none');
    $_fontinfoMenu.classList.add('display-none');
    $_glyphDiv.setAttribute('style', 'height:'+(window.innerHeight-90)+'px');
};
$_glyphTAB.addEventListener("click", clickTAB1, false);
$_fontinfoTAB.addEventListener("click", clickTAB2, false);
$_fonttableTAB.addEventListener("click", clickTAB3, false);

function loadGlyphInfo(char){
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
var id;
// for(var i=0; i)
'<canvas class="glyph-list" id="'+id+'"></canvas>'

// ********************************** //
// Loading default fonts              //
// ********************************** //


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
    var ret = 44032;
    var index1 = CHO.indexOf(arrIn[0]);
    var index2 = JUNG.indexOf(arrIn[1]);
    var index3 = JONG.indexOf(arrIn[2]);
    ret += (21*28*index1)+(28*index2)+(index3);
    return ret;
}
//for test
// String.fromCharCode(johap(['ㄱ','ㅏ','ㄴ']));
// String.fromCharCode(johap(GLYPH_SELECTION));

// returns array of possible 
function toGlyphList(arr){
    GLYPH_TABLE_LIST = [];
    if(arr[0]+arr[1]+arr[2] == ''){
        GLYPH_TABLE_LIST = '가각갂갃간갅갆갇갈갉갊갋갌갍갎갏감갑값갓갔강갖갗갘같갚갛개객갞갟갠갡갢갣갤갥갦갧갨갩갪갫갬갭갮갯갰갱갲갳갴갵갶갷갸갹갺갻갼갽갾갿걀걁걂걃걄걅걆걇걈걉걊걋걌걍걎걏걐걑걒걓걔걕걖걗걘걙걚걛걜걝걞걟걠걡걢걣'.split();
        console.log(GLYPH_TABLE_LIST);
        return;
    }

    var list1 = arr[0].length !== 0 ? arr[0].split('') : CHO;
    var list2 = arr[1].length !== 0 ? arr[1].split('') : JUNG;
    var list3 = arr[2].length !== 0 ? arr[2].split('') : JONG;

    for(i in list1){
        for(j in list2){
            for(k in list3){
                console.log('초성 : ' + list1[i],'중성 : ' + list2[j],'종성 : ' + list3[k])
                GLYPH_TABLE_LIST.push(johap([list1[i],list2[j],list3[k]]));
            }
        }
    }
    console.log(GLYPH_TABLE_LIST);
    var str = '';
    for(var i = 0; i < 100; i++){
        str += String.fromCharCode(GLYPH_TABLE_LIST[i]);
    }
    console.log(str);
};

drawGlyph(GLYPH_TO_DRAW);
function drawGlyph(char){
    console.log('drawing init')
    var tempPath = new paper.Path({
        strokeColor: 'black'
      });
    var points = char.path.commands;
    for(idx in points){
        var p = points[idx];
        if(p.type !== 'M' && p.type !== 'Z')
        // console.log('drawing',p.x, p.y);
        var min = CANVAS.width>CANVAS.height ? CANVAS.height : CANVAS.width;
        var tempPoint = new paper.Point((p.x*min/1000), CANVAS.height*0.75-(p.y*min/1000))
        tempPoint.selected = true;
        tempPath.add(tempPoint);
    }
    loadGlyphInfo(char);
}

//draw thumbnail canvas
function drawThumbNail(){
    for(i in $_allCanvas){
        var check = drawGlyphSmall($_allCanvas[i], i);
        if(check === -1) break;
    }
}

//@TODO
function drawGlyphSmall(canvas, index){

    if(GLYPH_TABLE_LIST[index] == undefined) return -1;
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
    var path = glyph.getPath(x0, fontBaseline, fontSize);
    // console.log(path);
    // for(i in path.commands){
    //     var temp = path.commands[i];
    //     console.log(temp.type,temp.x,temp.y);
    // }
    path.fill = "#333";
    // path.draw(ctx);
}

var ctx = $_allCanvas[0].getContext('2d');
ctx.clearRect(0,0,85,85);
var glyph1 = FONT.charToGlyph('각');
var path1 = glyph1.getPath()

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