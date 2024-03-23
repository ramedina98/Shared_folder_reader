import '../css/components/backAndForward.css'
import '../css/colors.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

type BackAndForwardProps = {
    goBack: () => void; 
}

function BackAndForward ({ goBack  }: BackAndForwardProps) {

    return (
        <>
            <button
                className='backandForwardButtons_button'
                onClick={goBack}
            >
                <ArrowBackIosIcon />
            </button>
        </>
    )
}

export default BackAndForward;