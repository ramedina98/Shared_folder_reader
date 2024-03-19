import '../css/App.css'; 
import '../css/colors.css';
import Cards from './Cards';
import Search from './Search';
import { useState, useEffect } from 'react';


function App() {

  // Define a state variable to store the list of files retrieved from the folder
  const [files, setFiles] = useState<string[]>([]);
  // Retrieve the folder path from environment variables
  const path = import.meta.env.VITE_REACT_APP_FOLDER;

  //TODO: seguir checando que otro tipo de documentos indeseados borramos...
  // Function to filter out unwanted files like .DS_Store
  function removeDSStore(files: string[]): string[] {
    return files.filter(file => file !== '.DS_Store');
  }

  // Fetch files from the specified folder path when the component mounts
  useEffect(() => {
    async function fetchFiles() {
      // Construct the folder path
      try {
        const folderPath = path; 
         // Call an Electron API function to get the list of files in the folder
        const files = await window.electronAPI.getFiles(folderPath);
        // Remove unwanted files from the list
        const f = removeDSStore(files);
        // Set the list of files to the state variable
        setFiles(f);
      } catch (error) {
        // Log an error message if there's an issue fetching the files
        console.error('Error al obtener los archivos:', error);
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

  return (
    <>
      <header>
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
            files.map((item: string, index: number) => (
              <Cards 
                key={index}
                documento={item}
              />
            ))
          )}
        </main>
      </section>
      <footer>
      </footer>
    </>
  )
}

export default App
