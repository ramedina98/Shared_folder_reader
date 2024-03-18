import '../../css/components/SearchBar.css';
import '../../css/colors.css';
import { useState } from 'react';

//TODO: aun hay que hacer que haga la busqueda dinamica...

function SearchBar(){

    //TODO:comentar este codigo que es para la seach bar...
    const [showButton, setShowButton] = useState(false); 

    const handleInputChanges = (event: any) => {
        const searchText = event.target.value; 
        setShowButton(searchText !== '');
    }

    const handleButton = () => {
        const inputElement = document.getElementById('searchInput') as HTMLInputElement;
        if(inputElement){
            inputElement.value = '';
            setShowButton(false);
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