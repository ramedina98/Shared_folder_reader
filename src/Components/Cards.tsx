import { useState, useEffect } from "react";
import ExcelImg from '../assets/img/excel.png';
import WordImg from '../assets/img/word.png';
import Power from '../assets/img/power.png';
import Pdf from '../assets/img/pdf.png';
import Folder from '../assets/img/folder.png';
import Image from '../assets/img/img.png';
//Agregar powerpoind y pdf...
import '../css/components/Cards.css';
import '../css/colors.css';

type CardsTypes = {
    documento: string;
    openFolder: (nameFolder: string) => void;
    pathFolder: string,
}
function Cards({ documento, openFolder, pathFolder }: CardsTypes) {

    // State variable to manage the file extension
    const [extension, setExtention] = useState<string>('');
    // State variable to handle whether it is folder or not...
    const [isFolder, setIsFolder] = useState<boolean>(false);

    // Function to check the file extension
    useEffect(() => {
        const checkFileExtension = (fileName: string): string => {
            const excelExtensions = ['.xls', '.xlsx', '.xlsm', '.xlsb'];
            const wordExtensions = ['.doc', '.docx', '.docm'];
            const powerpointExtensions = ['.ppt', '.pptx', '.pptm'];
            const pdfExtensions = ['.pdf'];
            const imgExtensions = ['.png', '.jpg', '.jpeg','.ico', '.icns', '.webp', '.svg', '.gif'];
        
            const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

            const lastDotIndex = fileName.lastIndexOf('.');
            if (extension === '' || lastDotIndex === -1) {
                setIsFolder(true);
                return 'folder';
            }
        
            if (excelExtensions.includes(extension)) {
                setIsFolder(false);
                return 'excel';
            } else if (wordExtensions.includes(extension)) {
                setIsFolder(false);
                return 'word';
            } else if (powerpointExtensions.includes(extension)) {
                setIsFolder(false);
                return 'powerpoint';
            } else if (pdfExtensions.includes(extension)) {
                setIsFolder(false);
                return 'pdf';
            } else if(imgExtensions.includes(extension)){
                setIsFolder(false);
                return 'image';
            }
            setIsFolder(false);
            return 'otro'; 
        }

        // Set the extension state based on the file name
        setExtention(checkFileExtension(documento));
    }, [documento]);

    // Function to open the file using Electron API
    const openFile = () => {
        // Construct the full file path
        const filePath = `${pathFolder}/${documento}`;

        // Verifica si el documento es un directorio
        if (isFolder) {
            // Si es una carpeta, abre la carpeta utilizando la API de Electron
            window.electronAPI.openFile(pathFolder);
        } else {
            // Si es un archivo, abre el archivo utilizando la API de Electron
            window.electronAPI.openFile(filePath);
        }
    }

    return (
        <>
            <div 
                onClick={isFolder ? () => openFolder(documento) : openFile} 
                className="card_conteiner"
            >
                <figure>
                    {extension === 'excel' && (
                        <img src={ExcelImg} alt="" />
                    )}
                    {extension === 'word' && (
                        <img src={WordImg} alt="" />
                    )}
                    {extension === 'powerpoint' && (
                        <img src={Power} alt="" />
                    )}
                    {extension === 'pdf' && (
                        <img src={Pdf} alt="" />
                    )}
                    {extension === 'folder' && (
                        <img src={Folder} alt="" />
                    )}
                    {extension === 'image' && (
                        <img src={Image} alt="" />
                    )}
                </figure>
                <div className="name_container">
                    <span>{documento}</span>
                </div>
            </div>
        </>
    )
}

export default Cards; 