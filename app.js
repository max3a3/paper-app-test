const {app, BrowserWindow} = require('electron');
const path = require('path');
const locals = {};
const pug = require('electron-pug')({pretty: true}, locals);

//Open Main window(first)
app.on('ready', ()=>{
  let mainWindow = new BrowserWindow({
    //do not show at first
    show: false,
    width: 800,
    height: 800,
    
    fullscreenWindowTitle: true,
    icon: './'
  });
  mainWindow.loadURL(path.join('file://', __dirname, 'main.pug'));
  //show when ready to show
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  })
});
