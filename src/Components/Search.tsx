/*In this component we take the seachBar and drop down menu components, these 
will help us to search for documents by their name (searchbar) or by their extension
(drop down menu)...*/
import { useEffect, useState } from 'react';
import '../css/Search.css';
import '../css/colors.css';
import DropDownMenu from './SearchComponents/DropDownMenu';
import SearchBar from './SearchComponents/SearchBar';

type SearchProps = {
    onSearch: (searchText: string) => void; 
}
function Search({onSearch}:SearchProps) {

    /* This is a list of file extensions for word and excel files, it is 
    part of the component props...*/
    const list = ['All file extension', '.docx', '.xlsx', '.ppt', '.pdf'];

    // Define state variables to store the window width and height
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth, 
        height: window.innerHeight,
    });

    // Set up an effect to update window size on resize
    useEffect(() => {
        // Function to handle window resize event and update state variables
        const handleResize = () => {
            // Update the state variables with the current window width and height
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Add an event listener for window resize and call handleResize function
        window.addEventListener('resize', handleResize);

        // Clean up function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);// Empty dependency array to run effect only once when component mounts

    return (
        <>
            <div className='search_component'>
                <SearchBar onSearch={onSearch}/>
                <DropDownMenu 
                    list={list}
                    menuStyle={{
                        position: 'absolute',
                        top: windowSize.width > 980 ? 260 : 325, 
                        right: windowSize.width > 980 ? 48 : 0,
                    }}
                    onSearch={onSearch}
                />
            </div>
        </>
    )
}

export default Search; 