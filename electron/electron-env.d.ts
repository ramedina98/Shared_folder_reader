/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  // Renderer process communication
  ipcRenderer: import('electron').IpcRenderer;
  // Expose Electron API to the renderer process
  electronAPI: {
    // Function to retrieve files from a folder
    getFiles: (folderPath: string) => Promise<string[]>;
    // Function to open a file using its file path
    openFile: (filePath: string) => void;
  };
}
