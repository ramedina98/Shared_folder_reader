import '../css/App.css'; 
import '../css/colors.css';
import Cards from './Cards';
import Search from './Search';
import CardSkeleton from '../Skeletons/CardSkeleton';
import Logo from '../assets/img/logo.png';
import { useState, useEffect } from 'react';
import AddPathButton from './AddPathButton';
import AddPathInput from './AddPathInput';


function App() {

  // Define a state variable to store the list of files retrieved from the folder
  const [files, setFiles] = useState<string[]>([]);
  // Define a state variable...
  const [loading, setLoading] = useState<boolean>(true); 
  // Retrieve the folder path from environment variables

  //TODO: seguir checando que otro tipo de documentos indeseados borramos...
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

  // Fetch files from the specified folder path when the component mounts
  useEffect(() => {
    async function fetchFiles() {
      // Construct the folder path
      try {
        //we are taking the path fot the folder, with the txt info...
        const content = await window.electronAPI.getPathsContent();
        const folderPath = content;
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
        setLoading(false);
      }
    }

    // Invoke the fetchFiles function when the component mounts
    fetchFiles();
  }, []);

  // Define a state variable to store the filtered list of files based on search text
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);

  // Function to handle search input and filter files based on search text
  const handleSearch = (searchText: string) => {
    // Filter the list of files to include only those that contain the search text (case insensitive)
    const filter = files.filter(file => file.toLowerCase().includes(searchText.toLowerCase()));
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

  return (
    <>
      {showPath && <AddPathInput onClick={handleCloseAddPath}/> }
      <header>
        <figure>
          <img src={Logo} alt="Logo" />
        </figure>
        <AddPathButton onClick={handleAddPathClick} />
      </header>
      <section>
        <Search onSearch={handleSearch}/>
        <main>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((item: string, index: number) => (
              <Cards 
                key={index}
                documento={item}
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
