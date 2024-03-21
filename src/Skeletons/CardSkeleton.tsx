import Skeleton from '@mui/material/Skeleton';
import '../css/components/Cards.css';
import '../css/colors.css';

function CardSkeleton(){

    return (
        <>
            <div 
                className="card_conteiner"
            >
                <Skeleton 
                    style={{
                        width: '85%',
                        height: '100px',
                        marginLeft: '0.2em'
                    }}
                    animation = 'wave'
                />
                <div className="name_container">
                    <Skeleton 
                        style={{
                            width: '85%',
                            height: '100px',
                            marginLeft: '0.5em'
                        }}
                        animation = 'wave'
                    />
                </div>
            </div>
        </>
    )
}

export default CardSkeleton;