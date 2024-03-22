import { useState, useEffect } from "react";
import ExcelImg from '../assets/img/excel.png';
import WordImg from '../assets/img/word.png';
import Power from '../assets/img/power.png';
import Pdf from '../assets/img/pdf.png';
//Agregar powerpoind y pdf...
import '../css/components/Cards.css';
import '../css/colors.css';

type CardsTypes = {
    documento: string;
}
function Cards({ documento }: CardsTypes) {

    // State variable to manage the file extension
    const [extension, setExtention] = useState<string>('');
    // Get the folder path from environment variables
    const [content, setContent] = useState<string>('');

    // This useEffect is to obtain the path to the folder required to work...
    useEffect(() => {
        async function fetchFiles() {
          // Construct the folder path
            try {
                const content = await window.electronAPI.getPathsContent();
                setContent(content);
            } catch (error) {
                // Log an error message if there's an issue fetching the files
                console.error('Error when getting the files', error);
            } 
        }
    
        // Invoke the fetchFiles function when the component mounts
        fetchFiles();
    }, []);

    // Function to check the file extension
    useEffect(() => {
        const checkFileExtension = (fileName: string): string => {
            const excelExtensions = ['.xls', '.xlsx', '.xlsm', '.xlsb'];
            const wordExtensions = ['.doc', '.docx', '.docm'];
            const powerpointExtensions = ['.ppt', '.pptx', '.pptm'];
            const pdfExtensions = ['.pdf'];
        
            const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
        
            if (excelExtensions.includes(extension)) {
                return 'excel';
            } else if (wordExtensions.includes(extension)) {
                return 'word';
            } else if (powerpointExtensions.includes(extension)) {
                return 'powerpoint';
            } else if (pdfExtensions.includes(extension)) {
                return 'pdf';
            }
        
            return 'otro'; 
        }

        // Set the extension state based on the file name
        setExtention(checkFileExtension(documento));
    }, [documento]);

    // Function to open the file using Electron API
    const openFile = () => {
        // Construct the full file path
        window.electronAPI.openFile(`${content}/${documento}`);
    }

    //TODO: try...
    const [_isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <>
            <div 
                onClick={openFile} 
                className="card_conteiner"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
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
                </figure>
                <div className="name_container">
                    <span>{documento}</span>
                </div>
            </div>
        </>
    )
}

export default Cards; 