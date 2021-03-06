var font = null;
var fontSize = 32;
var textToRender = 'Grumpy wizards make toxic brew for the evil Queen and Jack.';
var previewPath = null;
var canvas = document.getElementById('canvas');

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/\u0022/g, '&quot;')
         .replace(/\u0027/g, '&#039;');
}

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

function renderText() {
    if (!font) return;

    var previewCanvas = document.getElementById('preview');
    var previewCtx = previewCanvas.getContext("2d");
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    font.draw(previewCtx, textToRender, 0, 32, fontSize, {
        kerning: true,
        features: {
            liga: true,
            rlig: true
        }
    });
}

function showErrorMessage(message) {
    var el = document.getElementById('message');
    if (!message || message.trim().length === 0) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
    el.innerHTML = message;
}

function sortKeys(dict) {
    var keys = [];
    for (var key in dict) {
        keys.push(key);
    }
    keys.sort();
    return keys;
}

function displayNames(names) {
    var html = '';
    properties = sortKeys(names);
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        html += '<dt>'+escapeHtml(property)+'</dt><dd>';
        var translations = names[property];
        var langs = sortKeys(translations);
        for (var j = 0; j < langs.length; j++) {
            var lang = langs[j];
            var esclang = escapeHtml(lang);
            html += '<span class="langtag">' + esclang
                + '</span> <span class="langname" lang=' + esclang + '>'
                + escapeHtml(translations[lang]) + '</span> ';
        }
        html += '</dd>';
    }

    document.getElementById('name-table').innerHTML = html;
}

function displayFontData() {
    var html, tablename, table, property, value;

    for (tablename in font.tables) {
        table = font.tables[tablename];
        if (tablename == 'name') {
            displayNames(table);
            continue;
        }

        html = '';
        for (property in table) {
            value = table[property];
            html += '<dt>'+property+'</dt><dd>';
            if (Array.isArray(value) && typeof value[0] === 'object') {
                html += value.map(function(item) {
                    return JSON.stringify(item);
                }).join('<br>');
            } else if (typeof value === 'object') {
              html += JSON.stringify(value);
            } else if (['created', 'modified'].indexOf(property) > -1) {
                var date = new Date(value * 1000);
                html += date;
            }
            else {
                html += value;
            }
            html += '</dd>';
        }
        var element = document.getElementById(tablename+"-table");
        if (element) {
            element.innerHTML = html;
        }
    }

    if(font.kerningPairs) {
        var element = document.getElementById("kern-table");
        if (element) {
            element.innerHTML = '<dt>' + Object.keys(font.kerningPairs).length + ' Pairs</dt><dd>' + JSON.stringify(font.kerningPairs) + '</dd>';
        }
    }
}

function onFontLoaded(font) {
    window.font = font;
    renderText();
    displayFontData();
}

function onReadFile(e) {
    document.getElementById('font-name').innerHTML = '';
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            font = opentype.parse(e.target.result);
            onFontLoaded(font);
            showErrorMessage('');
        } catch (err) {
            showErrorMessage(err.toString());
            if (err.stack) console.log(err.stack);
	    throw(err);
        }
    };
    reader.onerror = function(err) {
        showErrorMessage(err.toString());
    };

    reader.readAsArrayBuffer(file);
}

var fontFileName = 'fonts/Roboto-Black.ttf';

document.getElementById('font-name').innerHTML = fontFileName.split('/')[1];

var fileButton = document.getElementById('file');
fileButton.addEventListener('change', onReadFile, false);

var tableHeaders = document.getElementById('font-data').getElementsByTagName('h3');
for(var i = tableHeaders.length; i--; ) {
    tableHeaders[i].addEventListener('click', function(e) {
        e.target.className = (e.target.className === 'collapsed') ? 'expanded' : 'collapsed';
    }, false);
}

enableHighDPICanvas('preview');

opentype.load(fontFileName, function(err, font) {
    var amount, glyph, ctx, x, y, fontSize;
    if (err) {
        showErrorMessage(err.toString());
        return;
    }
    onFontLoaded(font);
});