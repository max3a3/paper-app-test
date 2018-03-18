const remote = require('electron').remote;
const opentype = remote.getGlobal('opentype');
const path = require('path');
// const jquery = $ = require('jquery');
console.log(opentype);

let font;
let fontFileName = 'fonts/SDGTM.ttf';

loadFont(fontFileName);

document.getElementById('load-default').addEventListener('click', function(){
    loadFont(fontFileName);
});

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

function onReadFile(e) {
    // document.getElementById('font-name').innerHTML = '';
    var temp = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            console.log('try');
            var font = opentype.parse(e.target.result);
            onFontLoaded(font);
            // showErrorMessage('');
        } catch (err) {
            console.log('catch');
            // showErrorMessage(err.toString());
            if (err.stack) console.log(err.stack);
        throw(err);
        console.log('throw');
        }
    };
    reader.onerror = function(err) {
        showErrorMessage(err.toString());
    };
    reader.readAsArrayBuffer(temp);
}

function onFontLoaded(font) {
    window.font = font;
    // renderText();
    // displayFontData();
}

var fileButton = document.getElementById('file');
fileButton.addEventListener('change', onReadFile, false);

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
let glyphTAB = document.getElementById('glyphs');
var fontinfoTAB = document.getElementById('fontinfo');
var fonttable = document.getElementById('fonttable');
function clickTAB1 (){
    console.log('glyphTAB clicked');
    glyphTAB.classList.add('selected');
};
glyphTAB.addEventListener("click", clickTAB1, false);
// glyphTAB.onclick = function(){
//     console.log('glyphTAB clicked');
// }
// glyphTAB.addEventListener("click", )