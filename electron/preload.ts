import { contextBridge, ipcRenderer, shell } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))

// Define an asynchronous function to fetch files from a folder using IPC
async function getFilesFromFolder(folderPath: string): Promise<string[]> {
  // Invoke the 'get-files' IPC event to retrieve files from the main process
  try {
      const files = await ipcRenderer.invoke('get-files', folderPath);
      return files;
  } catch (error:any) {
    // Throw an error if there's any issue retrieving files
      throw new Error(`Error al leer los archivos: ${error.message}`);
  }
}

// Function to get the content of the 'paths.txt' file from the main process
async function getPathsFileContent(): Promise<string> {
  try {
    // Invoke the 'get-paths-content' IPC event to retrieve the content
    const content = await ipcRenderer.invoke('get-paths-content')
    return content; // Return the content of the file
  } catch (error: any) {
    // Throw an error if there's any issue retrieving the content
    throw new Error(`Error getting the content of the paths.txt file:  ${error.message}`)
  }
}

// Function to update the content of the 'paths.txt' file in the main process
async function updatePathsFileContent(content: string): Promise<string> {
  try {
    // Invoke the 'update-paths-content' IPC event to update the content
    const result = await ipcRenderer.invoke('update-paths-content', content);
    return result; // Return the result of the update operation
  } catch (error: any) {
    // Throw an error if there's any issue updating the content
    throw new Error(`Error updating the content of paths.txt file: ${error.message}`);
  }
}

// Expose the 'getFiles' function and the 'openFile' function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getFiles: getFilesFromFolder,
  getPathsContent: getPathsFileContent,
  openFile: shell.openPath,
  updatePathsContent: updatePathsFileContent,
});

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
