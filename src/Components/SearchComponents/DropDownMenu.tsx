import { useState, CSSProperties } from 'react';
import '../../css/components/DropDownMenu.css'

type DropDownMenuProps = {
    lis: string[];
    menuStyle: CSSProperties,
    onSearch: (searchText: string) => void; 
}

function DropDownMenu({ lis, menuStyle, onSearch }: DropDownMenuProps){

    // State variables for managing the display of the dropdown menu and its name
    const [display, setDisplay] = useState<'block' | 'none'>('none');
    const [dropName, setDropName] = useState<string>('Extension');

    // Function to toggle the display of the dropdown menu
    const handleDisplay = () => {
        // Toggle between 'block' and 'none' to show/hide the dropdown menu
        setDisplay(prevDisplay => (prevDisplay === 'block' ? 'none' : 'block'));
    }

    // Function to handle click on dropdown menu item
    const heandleItemClick = (item: string) => {
        // Call the onSearch function with the clicked item as argument
        onSearch(item);
        // Update the dropdown name to the clicked item
        setDropName(item);
        // Hide the dropdown menu after item click
        setDisplay('none');
    }

    return (
        <>
            <div
                onClick={handleDisplay}
                className='drop'
            >
                {dropName}
            </div>
            <div 
                style={{...menuStyle, display}}
                className='menu'
            >
                <ul>
                    {lis.map((item: string, index: number) => (
                        <li
                            key={index}
                            onClick={() => heandleItemClick(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default DropDownMenu; 