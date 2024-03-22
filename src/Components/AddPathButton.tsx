import '../css/components/AddPathButton.css';
import '../css/colors.css';
import OpenWithIcon from '@mui/icons-material/OpenWith';

type AddPathButton = {
    onClick: () => void; 
}

const AddPath = ({ onClick } :AddPathButton) => {

    return (
        <button
            onClick={onClick}
            className='buttonAddPath'
        >
            <div
                className='contText_buttonAddPath'
            >
                <span>Add a path</span>
            </div>
            <div
                className='contFigure'
            >
                <OpenWithIcon 
                    style={{
                        width: '100%',
                        fontSize: '1.5em'
                    }}
                />
            </div>
        </button>
    );
};

export default AddPath; 