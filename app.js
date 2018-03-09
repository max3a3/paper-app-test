const {app, BrowserWindow} = require('electron');
const path = require('path');

//Open Main window(first)
app.on('ready', ()=>{
  let mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 1000
  });
  mainWindow.loadURL(path.join('file://', __dirname, 'index.pug'));
});
