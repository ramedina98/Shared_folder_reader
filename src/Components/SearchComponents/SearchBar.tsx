import '../../css/components/SearchBar.css';
import '../../css/colors.css';
import { useState } from 'react';

//TODO: aun hay que hacer que haga la busqueda dinamica...
type SearchBarProps = {
    onSearch: (searchText: string) => void; 
}

function SearchBar({ onSearch }:SearchBarProps){

    // State variable to manage the visibility of the clear button
    const [showButton, setShowButton] = useState(false); 

    // Function to handle changes in the search input
    const handleInputChanges = (event: any) => {
        // Extract the search text from the input event
        const searchText = event.target.value; 
        // Set showButton state based on whether there is text in the input
        setShowButton(searchText !== '');
        // Call the onSearch function with the search text as argument
        onSearch(searchText);
    }

    // Function to handle click on the clear button
    const handleButton = () => {
        // Find the search input element
        const inputElement = document.getElementById('searchInput') as HTMLInputElement;
        // Clear the input value
        if(inputElement){
            inputElement.value = '';
            // Hide the clear button
            setShowButton(false);
            // Call the onSearch function with an empty string to reset the search
            onSearch('');
        }
    }

    return (
        <>
            <div className='conteiner_searchBar'>
                <input onChange={handleInputChanges} type="text" id="searchInput" placeholder="Name of the file to search"/>
                <button onClick={handleButton} className={showButton ? 'visible' : ''}>X</button>
            </div>
        </>
    )
}

export default SearchBar; 