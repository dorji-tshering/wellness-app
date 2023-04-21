import { useAuthValue } from "../utils/authContext";
import { MdHealthAndSafety } from 'react-icons/md';
import { Link } from "react-router-dom";

const DesktopSidebar = () => {
    const user = useAuthValue();
console.log(user)
    return (
        <div className="bg-white w-[200px] border-r border-r-mainBorder shadow-md px-5 py-7">
            <div className="flex items-center">
                <MdHealthAndSafety className="text-theme" size={40}/>
                <h2><span className="text-sm text-gray-500">Hello</span> {user?.displayName}</h2>
            </div>
            <div className="flex flex-col">
                <a href='/fitness'>
                    <span>Fitness</span>
                </a>
                <Link to='/nutrition'>
                    Nutrition
                </Link>
                <Link to='/wellness'>
                    Wellness
                </Link>
            </div>
        </div>
    )
}

export default DesktopSidebar