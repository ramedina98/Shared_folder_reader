import '../css/components/AddPathInput.css';
import '../css/colors.css';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { Skeleton } from '@mui/material';

type AddPathInput = {
    onClick: () => void; 
}

function AddPathInput({ onClick }: AddPathInput){

    // Define a state variable to get the current path...
    const [currentPath, setCurrentPath] = useState<string>('');
    // Define a state variable...
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch data from the paths.txt file...
    useEffect(() => {
        async function fetchFiles() {
            // Construct the folder path
            try {
                //we are taking the path fot the folder, with the txt info...
                const content = await window.electronAPI.getPathsContent();
                setCurrentPath(content);
            } catch (error) {
                // Log an error message if there's an issue fetching the files
                console.error('Error getting the files', error);
            } finally{
                setLoading(false);
            }
        }

        // Invoke the fetchFiles function when the component mounts
        fetchFiles();
    }, []);

    // Define a state variable get the value of the input... 
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    /*when you click on the button you have to validate that the input is not empty, 
    arrange the data and then send it.*/
    const handleButtonClick = async () => {
        if(inputValue.trim() !== ''){
            try {
                // Update the paths.txt file with the new content
                await window.electronAPI.updatePathsContent(inputValue.trim());
                // Refresh the current path display
                setCurrentPath(inputValue.trim());
                // Clear the input field
                setInputValue('');
            } catch (error) {
                console.error('Error updating paths.txt file', error);
            }
        }
    }

    return (
        <>
            <div
                className="cont_addpathinput"
            >
                <form
                    className='inputCont'
                >
                    <button
                        className='closeIconCont'
                        onClick={onClick}
                    >
                        <CloseIcon />
                    </button>
                    <label htmlFor="">Write the path</label>
                    <input onChange={handleInputChange} type="text" placeholder='Path //'/>
                    <button
                        className='sendButton'
                        onClick={handleButtonClick}
                    >
                        Send
                    </button>
                    {/*Here we can see the current path...*/}
                    <div
                        className='currentPath_cont'
                    >
                        {loading ? (
                            <Skeleton 
                                height={35}
                                animation='wave'
                            />
                        ) : (
                            <span>Current Path: {currentPath}</span>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddPathInput;