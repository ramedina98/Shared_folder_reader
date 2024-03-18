import { useState, CSSProperties } from 'react';
import '../../css/components/DropDownMenu.css'

//TODO: todabia falta que el drop down menu pueda realizar la busqueda dinamica...

type DropDownMenuProps = {
    lis: string[];
    menuStyle: CSSProperties
}

function DropDownMenu({ lis, menuStyle }: DropDownMenuProps){

    //TODO: comentar el codigo para el drop down menu...
    const [display, setDisplay] = useState<'block' | 'none'>('none');

    const handleDisplay = () => {
        setDisplay(prevDisplay => (prevDisplay === 'block' ? 'none' : 'block'));
    }

    return (
        <>
            <div
                onClick={handleDisplay}
                className='drop'
            >
                Extension
            </div>
            <div 
                style={{...menuStyle, display}}
                className='menu'
            >
                <ul>
                    {lis.map((item: string, index: number) => (
                        <li
                            key={index}
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