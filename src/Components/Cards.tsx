import { useState, useEffect } from "react";
import ExcelImg from '../assets/img/excel.png';
import WordImg from '../assets/img/word.png';
import '../css/components/Cards.css';
import '../css/colors.css';

type CardsTypes = {
    documento: string;
}
function Cards({ documento }: CardsTypes) {

    // State variable to manage the file extension
    const [extension, setExtention] = useState<string>('');
    // Get the folder path from environment variables
    const path = import.meta.env.VITE_REACT_APP_FOLDER;

    // Function to check the file extension
    useEffect(() => {
        const checkFileExtension = (fileName: string): string => {
            const excelExtensions = ['.xls', '.xlsx', '.xlsm', '.xlsb'];
            const wordExtensions = ['.doc', '.docx', '.docm'];
        
            const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
        
            if (excelExtensions.includes(extension)) {
                return 'excel';
            } else if (wordExtensions.includes(extension)) {
                return 'word';
            } 
        
            return 'otro'; 
        }

        // Set the extension state based on the file name
        setExtention(checkFileExtension(documento));
    }, [documento]);

    // Function to open the file using Electron API
    const openFile = () => {
        // Construct the full file path
        window.electronAPI.openFile(`${path}/${documento}`);
    }

    return (
        <>
            <div 
                onClick={openFile} 
                className="card_conteiner"
            >
                <figure>
                    {extension === 'excel' && (
                        <img src={ExcelImg} alt="" />
                    )}
                    {extension === 'word' && (
                        <img src={WordImg} alt="" />
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