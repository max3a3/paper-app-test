const remote = require('electron').remote;
const opentype = remote.getGlobal('opentype');
const path = require('path');
// const jquery = $ = require('jquery');
console.log(opentype);

let font;
let fontFileName = 'fonts/SDGTM.ttf';

// ********************************** //
// left menu tab controls             //
// ********************************** //

let glyphTAB = document.getElementById('glyphs');
let fontinfoTAB = document.getElementById('fontinfo');
let fonttableTAB = document.getElementById('fonttable');
let glyphMenu = document.getElementById('glyph-menu');
let fontinfoMenu = document.getElementById('info-menu');
let fonttableMenu = document.getElementById('table-menu');

let rightMenuTabs = document.querySelectorAll('.menu-selection div');
for(var i = 0; i < rightMenuTabs.length; i++){
    console.log('adding event listener!')
    rightMenuTabs[i].addEventListener('click', function(){
        clickTab(i);
    });
}

function clickTab(index){
    console.log('selected!')
    for(var i = 0; i < rightMenuTabs.length; i++){
        rightMenuTabs[i].classList.remove('selected');
        document.querySelector('.menu-right').children[i+1].classList.add('display-none');
    }
    rightMenuTabs[index].classList.add('selected');
    document.querySelector('.menu-right').children[index+1].classList.remove('display-none');
}

// let clickTAB1 = function (){
//     console.log('glyphs TAB clicked');
//     glyphTAB.classList.add('selected');
//     fontinfoMenu.classList.remove('selected');
//     fonttableMenu.classList.remove('selected');
//     glyphMenu.classList.remove('display-none');
//     fontinfoMenu.classList.add('display-none');
//     fonttableMenu.classList.add('display-none');
// };
// let clickTAB2 = function (){
//     console.log('font info TAB clicked');
//     fontinfoTAB.classList.add('selected');
//     fontinfoMenu.classList.remove('display-none');
//     glyphMenu.classList.add('display-none');
//     fonttableMenu.classList.add('display-none');
// };
// let clickTAB3 = function (){
//     console.log('font info TAB clicked');
//     fonttableTAB.classList.add('selected');
//     fonttableMenu.classList.remove('display-none');
//     glyphMenu.classList.add('display-none');
//     fontinfoMenu.classList.add('display-none');
// };

glyphTAB.addEventListener("click", clickTAB1, false);
fontinfoTAB.addEventListener("click", clickTAB2, false);
fonttableTAB.addEventListener("click", clickTAB3, false);


loadFont(fontFileName);

function loadFont(fontFileName){
    font = opentype.loadSync(fontFileName);
    console.log('loaded ', font.names.fontFamily.en, font.names.fontFamily.ko);
    listAll(font.names);
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
var indexButtons = document.querySelectorAll('.index-button')
indexButtons.addEventListener('mousedown', ()=>{
    console.log('clicked');
    this.classList.add('index-selected');
}, false);
document.querySelectorAll('.index-selected').addEventListener('click', ()=>{
    console.log('clicked');
    this.classList.remove('index-selected');
}, false);
//add Listeners to Left menu tabs


// glyphTAB.onclick = function(){
//     console.log('glyphTAB clicked');
// }
// glyphTAB.addEventListener("click", )