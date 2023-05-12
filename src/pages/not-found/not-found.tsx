import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className='h-full w-full flex flex-col items-center mt-32'>
            <p className="text-center text-gray-600">Seems like the page is either deleted, removed, or doesn't exist.</p>
            <button onClick={() => navigate('/')}
                className="border border-black rounded-full px-8 py-3 mt-6
                hover:scale-105 transition-all duration-300 ease-in-out
                hover:ring-2 hover:ring-gray-200">Back to home</button>
        </div>
    )
}

export default NotFound