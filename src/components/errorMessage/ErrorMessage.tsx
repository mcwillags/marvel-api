import Error from './error.gif';

const ErrorMessage = () => {
    return (
        <img style={{display: 'block', width:"250px", height:"250px", objectFit:
            'contain', margin:"0 auto"}} src={Error} alt='Error message'></img>
    )
}


export default ErrorMessage;