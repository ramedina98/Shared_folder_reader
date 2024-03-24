import '../css/App.css'; 
import '../css/colors.css';
import Cards from './Cards';
import Search from './Search';
import CardSkeleton from '../Skeletons/CardSkeleton';
import Logo from '../assets/img/logo.png';
import { useState, useEffect } from 'react';
import AddPathButton from './AddPathButton';
import AddPathInput from './AddPathInput';
import BackAndForward from './BackAndForward';


function App() {

  // Define a state variable to store the list of files retrieved from the folder
  const [files, setFiles] = useState<string[]>([]);
  // Define a state variable...
  const [loading, setLoading] = useState<boolean>(true); 
  // Define a state variable to store the path...
  const [folderPath, setFolderPath] = useState<string>('');
  // Define a state variable to store the old paths...
  const [oldFolderPath, setOldFolderPath] = useState<string[]>([]);
  // Define a state variable to display the back or forward buttons...
  const [backAndForward, setBackAndForward] = useState<boolean>(false);

  // Function to filter out unwanted files like .DS_Store
  function removeDSStore(files: string[]): string[] {
    return files.filter(file => file !== '.DS_Store');
  }

  function removeUndesiredFiles(files: string[]): string[] {
    // Define an array of undesired starting characters
    const undesiredStartCharacters = ['-', '$', '~$'];
    
    // Filter the files array to remove undesired files
    return files.filter(file => {
      // Extract the first two characters of the file name
      const firstChars = file.substring(0, 2);
        
      // Check if any of the undesired starting characters match the file's prefix
      // If none of the undesired characters match, include the file in the filtered list
      return !undesiredStartCharacters.some(prefix => firstChars.startsWith(prefix));
    });
  }

  useEffect(() => {
    async function fetchFiles() {
      try{
        //Get the initial folder path...
        const initialFolderPath = await window.electronAPI.getPathsContent();
        setFolderPath(initialFolderPath);
      } catch(error){
        console.log('Error obtaining the folder path', error);
      }
    }

    fetchFiles();
  }, []);

  // Fetch files from the specified folder path when the component mounts
  useEffect(() => {
    async function getAndSetFiles() {
      if(folderPath){ // Check oif the folder path has been set...
        // Construct the folder path
        try {
          // Call an Electron API function to get the list of files in the folder
          const files = await window.electronAPI.getFiles(folderPath);
          // Remove unwanted files from the list
          const f = removeDSStore(files);
          // Remove Undesired Files...
          const f1 = removeUndesiredFiles(f);
          // Set the list of files to the state variable
          setFiles(f1);
        } catch (error) {
          // Log an error message if there's an issue fetching the files
          console.error('Error getting the files', error);
        } finally{
          // we update the skeleton value...
          setLoading(false);
        }
      }
    }

    // Invoke the fetchFiles function when the component mounts
    getAndSetFiles();
  }, [folderPath]); // Execute this effect whenever the folder path changes...

  // Define a state variable to store the filtered list of files based on search text
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);

  // Function to handle search input and filter files based on search text
  const handleSearch = (searchText: string) => {
    //trimed string...
    const trimedSearchText = searchText.trim();
    // Filter the list of files to include only those that contain the search text (case insensitive)
    const filter = files.filter(file => file.toLowerCase().includes(trimedSearchText.toLowerCase()));
    // Set the filtered list of files to the state variable
    setFilteredFiles(filter);
  }

  //Define state for controlling the visibility of the path input component...
  const [showPath, setShowPath] = useState<boolean>(false);

  // Function to handle click event of tha add path button...
  const handleAddPathClick = () => {
    // Set the state to true to show the component...
    setShowPath(true);
  }

  // Function to handle the close event of the path input component...
  const handleCloseAddPath = () => {
    // Set the state to false to show the component...
    setShowPath(false);
  }

  const clearButton = () => { // Definition of a function named clearButton...
    // Search of the HTML element with the class '.conteiner_searchBar button' and store it in the variable clearButton
    const clearButton = document.querySelector('.conteiner_searchBar button') as HTMLButtonElement;

    // check if the clearButton element exists
    if (clearButton) {
      // i fthe button exists, simulate a click on it...
      clearButton.click();
      //clear the state of filteredFiles by setting it to an empty array...
      setFilteredFiles([]);
      // set the loading state to true, typicall indicating that some process is beang loaded...
      setLoading(true); 
      //set a timer to set the loading state to false after 2 seconds...
      setTimeout(() => {
        setLoading(false);
      }, 2000); 
      // Update the state of files with the current value of files...
      setFiles(files);
    }
  }

  //handle openFolder
  const handleOpenFolder = (nameFolder: string) => {
    // adding to the current path the name of the folder to which we want to go to
    const newPath = folderPath + '/' + nameFolder;
    // we mark this state as true to show the back button 
    setBackAndForward(true);
    // we update this state to send the new path...
    setFolderPath(newPath);
    // store the prev path, for the back button to use...
    setOldFolderPath(prevOldFolderPath => [...prevOldFolderPath, folderPath]);
    // clear button function...
    clearButton();
  }
  
  // Functio to handle the return to previews... 
  const handleGoBack = () => {
    // Copy the oldFolderPath array
    const paths = [...oldFolderPath]; 
    
    // Check if there are elements in the array
    if (paths.length > 0) {
      // Get the last element of the array
      const back: any = paths.pop();
      
      // Update the state with the last element
      setFolderPath(back);
      // Update the state ... 
      setOldFolderPath(paths);

      //clear button function... 
      clearButton();

      if(paths.length === 0){
        setBackAndForward(false);
      }

      

    } else {
      // Handle the case where oldFolderPath is empty
      console.log("No navigation history available.");
    }
  }

    console.log('Archivos filtrados: ', filteredFiles);
  return (
    <>
      {showPath && <AddPathInput onClick={handleCloseAddPath}/> }
      <header>
        <figure>
          <img src={Logo} alt="Logo" />
        </figure>
        {backAndForward ? (
          <BackAndForward 
            goBack={handleGoBack}
          />
        ) : (
          <AddPathButton onClick={handleAddPathClick} />
        )}
      </header>
      <section>
        <Search onSearch={handleSearch} />
        <main>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((item: string, index: number) => (
              <Cards 
                key={index}
                documento={item}
                openFolder={handleOpenFolder}
                pathFolder={folderPath}
              />
            ))
          ) : (
            loading ? (
              Array(8).fill(0).map((_item: any, index: number) => (
                <CardSkeleton key={index} />
              ))
            ) : (
              files.map((item: string, index: number) => (
                <Cards 
                  key={index}
                  documento={item}
                  openFolder={handleOpenFolder}
                  pathFolder={folderPath}
                />
              ))
            )
          )}
          </main>
      </section>
      <footer>
      </footer>
    </>
  )
}

export default App
