import { useNotification } from "../utils/notification-context";
import { IoMdClose } from 'react-icons/io';

const Notification = () => {
    const notification = useNotification();
    
    setTimeout(() => {
        notification?.setNotification('');
    }, 3000);

    return (
        <div className="fixed top-5 right-0 z-30 left-0 mx-auto px-2">
            <div className="bg-green-600 items-stretch text-white flex mx-auto w-fit text-sm rounded-md">
                <p className="px-3 py-1">{notification?.notification}</p>
                <button 
                    onClick={() => notification?.setNotification('')}
                    className="flex items-center px-3 hover:bg-green-700 rounded-md"><IoMdClose size={17}/></button>
            </div>
        </div>
    )
}

export default Notification