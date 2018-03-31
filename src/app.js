const {app, BrowserWindow} = require('electron');
const path = require('path');
const locals = {};
const pug = require('electron-pug')({pretty: true}, locals);
global.opentype = require('opentype.js');
// import mainpug from 'main.pug';

//Open Main window(first)
app.on('ready', ()=>{
  // let testWindow = new BrowserWindow({
  //   show: false,
  //   fullscreenWindowTitle: true,
  //   width: 1000,
  //   height: 1000
  // });
  // testWindow.loadURL(path.join('file://', __dirname, 'test.pug'));

  let mainWindow = new BrowserWindow({
    //do not show at first
    show: false,
    width: 1200,
    height: 765,
    // resizable: false,
    fullscreenWindowTitle: true,
    icon: './'
  });
  mainWindow.loadURL(path.join('file://', __dirname, 'main.pug'));
  // show when ready to show
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    // check web contents
    // var cont = mainWindow.webContents;
    // console.log(cont);
    
    //install devtron to devtools
    //@only for development
    // require('devtron').install();
    // mainWindow.openDevTools();
    // mainWindow.webContents.send('init-opentype', opentype);
  })
  // testWindow.on('ready-to-show', () => {
  //   testWindow.show();
  //   //install devtron to devtools
  //   //@only for development
  //   require('devtron').install();
  //   testWindow.openDevTools();
  //   // mainWindow.webContents.send('init-opentype', opentype);
  // })


});
