const remote = require('electron').remote;
var opentype = remote.getGlobal('opentype');
console.log(opentype);

var font;

document.getElementById('load-default').addEventListener('click', function(){
    loadFont();
})

function loadFont(){
    window.font = opentype.loadSync('fonts/SDGTM.ttf');
    
    console.log(font);
    listAll(font);
}

function listAll(o){
    if(typeof o === 'Object'){
        for(each in o){
            listAll(o[each]);
        }
    } else {
        console.log(o)
    }
}

function onReadFile(e) {
    // document.getElementById('font-name').innerHTML = '';
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var font = opentype.parse(e.target.result);
            onFontLoaded(font);
            // showErrorMessage('');
        } catch (err) {
            // showErrorMessage(err.toString());
            if (err.stack) console.log(err.stack);
	    throw(err);
        }
    };
    reader.onerror = function(err) {
        showErrorMessage(err.toString());
    };
    reader.readAsArrayBuffer(file);
}

function onFontLoaded(font) {
    window.font = font;
    // renderText();
    // displayFontData();
}

var fileButton = document.getElementById('file');
fileButton.addEventListener('change', onReadFile, false);