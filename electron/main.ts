import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
var fs = require('fs');

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, '../public/folder.icns'),
    width: 800, 
    height: 680, 
    minWidth: 450, 
    minHeight: 500,
    webPreferences: {
      contextIsolation: true, 
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Handle the 'get-files' IPC event in the main process
  ipcMain.handle('get-files', async (_event, folderPath: string) => {
    try {
      // Read the files from the folder using fs.promises.readdir
        const files = await fs.promises.readdir(folderPath);
        return files;
    } catch (error:any) {
      // Throw an error if there's any issue reading the files
        throw new Error(`Error al leer los archivos: ${error.message}`);
    }
  });

  const pathTxt = path.join(__dirname, '..', 'public', 'data', 'paths.txt'); // Path to the paths.text file
  console.log('path: ', pathTxt);
  // Here we handle the request of the data that are in the paths.txt file...
  ipcMain.handle('get-paths-content', async () => {
    try{
      //Read the data fromt the paths.txt file...
      const content = fs.promises.readFile(pathTxt, 'utf-8'); 
      return content; // return the content of the file...
    }catch(error: any){
      // Throw an error if there's any issue reading the file
      throw new Error(`Error when reading paths.txt file ${error.message}`);
    }
  })

  
  // Handle the request to update the content of the 'paths.txt' file
  ipcMain.handle('update-paths-content', async (_event, content: string) => {
    try {
      // Clear existing data in the file
      fs.writeFileSync(pathTxt, '');
      // Write new data to the file
      fs.writeFileSync(pathTxt, content);
      return 'Paths content updated successfully.'; // Return success message
    } catch (error: any) {
      // Throw an error if there's any issue updating the file
      throw new Error(`Error updating paths.txt file: ${error.message}`);
    }
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)