/*In this component we take the seachBar and drop down menu components, these 
will help us to search for documents by their name (searchbar) or by their extension
(drop down menu)...*/
import { useEffect, useState } from 'react';
import '../css/Search.css';
import '../css/colors.css';
import DropDownMenu from './SearchComponents/DropDownMenu';
import SearchBar from './SearchComponents/SearchBar';
function Search() {

    /* This is a list of file extensions for word and excel files, it is 
    part of the component props...*/
    const list = ['.docx', '.doc', '.xlsx', '.xls']

    //TODO: comentar este codigo...

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth, 
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className='search_component'>
                <SearchBar />
                <DropDownMenu 
                    lis={list}
                    menuStyle={{
                        position: 'absolute',
                        top: windowSize.width > 980 ? 240 : 305, 
                        right: windowSize.width > 980 ? 50 : 0,
                    }}
                />
            </div>
        </>
    )
}

export default Search; 