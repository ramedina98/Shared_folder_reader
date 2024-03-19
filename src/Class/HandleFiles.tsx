const fs = require('fs');

// Función para obtener los nombres de los archivos de una carpeta
export async function getFilesNames(folderPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err:any, files:any) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}