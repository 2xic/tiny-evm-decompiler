import 'reflect-metadata';
import { app, BrowserWindow, ipcMain } from 'electron';
import { GetOpcodesInteractor } from './interactors/GetOpcodesInteractor';
import { GetCodeBlocksInteractor } from './interactors/GetCodeBlocksInteractor';
import { GetControlsFlowInteractor } from './interactors/GetControlsFlowInteractor';
const url = require('url')
const path = require('path')

let win;

function createWindow() {
   
   win = new BrowserWindow({
      width: 800, height: 600,
      webPreferences: {
         preload: path.join(__dirname, 'IpcCommands.js'),
         nodeIntegration: true,
         contextIsolation: true,
      }
   })
   win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }))

   ipcMain.on('load', (event, contract) => {
      console.log({
         contract,
      })
      const opcodes = new GetOpcodesInteractor().getOpcodes({
         contract,
      })
      console.log(opcodes);
      event.sender.send('contractOpcodes', JSON.stringify(opcodes));
   })

   ipcMain.on('load_example', async (event) => {
      const opcodes = new GetOpcodesInteractor().getOpcodes({
         contract: '6080604052348015600f57600080fd5b506004361060325760003560e01c806345773e4e14603757806382edd49d146074575b600080fd5b60408051808201909152601181527048656c6c6f20576f726c642c206f6b617960781b60208201525b604051606b91906098565b60405180910390f35b60408051808201909152600981526848656c6c6f2065766d60b81b60208201526060565b600060208083528351808285015260005b8181101560c35785810183015185820160400152820160a9565b8181111560d4576000604083870101525b50601f01601f191692909201604001939250505056fea2646970667358221220a3394a043a48ab6c9e440cc720e5e344ae2b01b480bada3a24807fd2f363c07264736f6c634300080d0033'
      })
      event.sender.send('contractOpcodes', JSON.stringify(opcodes));
      const contractCodeBlcoks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes);
      event.sender.send('contractCodeBlocks', JSON.stringify(contractCodeBlcoks));

      const contractGraphBlocks = await new GetControlsFlowInteractor().getControlFlow({
         codeBlocks: contractCodeBlcoks
      });
      event.sender.send('contractGraphBlocks', JSON.stringify(contractGraphBlocks));
   })
   win.openDevTools();
}

app.on('ready', () => {
   createWindow();
})
