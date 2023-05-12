import { useAuthValue } from "../../utils/auth-context";
import { MdHealthAndSafety } from 'react-icons/md';
import { NavLink } from "react-router-dom";
import { IoIosFitness } from 'react-icons/io';
import { GiFruitBowl, GiPeaceDove } from 'react-icons/gi';
import { BiLogOutCircle } from 'react-icons/bi';
import { logOut } from "../../services/facade.service";
import { useAppDispatch } from "../../state/hooks";
import { resetAll } from "../../state/hooks";

const DesktopSidebar = () => {
    const user = useAuthValue();
    const dispatch = useAppDispatch();
    
    return (
        <div className="bg-white min-w-[200px] max-w-[200px] border-r border-r-mainBorder shadow-md py-7 flex flex-col">
            <div className="flex items-center px-5 border-b border-mainBorder pb-5">
                <NavLink to='/'>
                    <MdHealthAndSafety className="text-theme" size={40}/>
                </NavLink>
                <h2><span className="text-sm text-gray-500">Hello</span> {user?.displayName}</h2>
            </div>
            <div className="flex flex-col mt-5">
                <NavLink 
                    to='/fitness' 
                    className={({isActive}) => (
                        isActive ? 'bg-theme/5 [&>*]:text-theme' : 'hover:bg-black/5'
                    ) + ' flex items-center py-3 px-5'}
                >
                    <IoIosFitness className="text-gray-700"/>
                    <span className="ml-2">Fitness</span>
                </NavLink>
                <NavLink 
                    to='/nutrition'
                    className={({isActive}) => (
                        isActive ? 'bg-theme/5 [&>*]:text-theme' : 'hover:bg-black/5'
                    ) + ' flex items-center py-3 px-5'}
                >
                    <GiFruitBowl className="text-gray-700"/>
                    <span className="ml-2">Nutrition</span>
                </NavLink>
                <NavLink 
                    to='/wellness'
                    className={({isActive}) => (
                        isActive ? 'bg-theme/5 [&>*]:text-theme' : 'hover:bg-black/5'
                    ) + ' flex items-center py-3 px-5'}    
                >
                    <GiPeaceDove className="text-gray-700"/>
                    <span className="ml-2">Wellness</span>
                </NavLink>
            </div>

            <div className="grow flex flex-col justify-center">
                <button 
                    onClick={() => {
                      logOut();
                      dispatch(resetAll());
                    }}
                    className="text-left px-5 py-3 flex items-center text-gray-600 hover:text-black
                    hover:bg-black/5">
                        <BiLogOutCircle className="mr-2 text-gray-700"/> Logout</button>
            </div>
        </div>
    )
}

export default DesktopSidebar;