import React, { SetStateAction, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseClient';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoIosFitness } from 'react-icons/io';
import { GiFruitBowl, GiPeaceDove } from 'react-icons/gi';
import { VscChromeClose } from 'react-icons/vsc';
import { useAuthValue } from '../utils/authContext';

type Props = {
    showMenu: boolean;
    setShowMenu: React.Dispatch<SetStateAction<boolean>>
}

const MobileMenu = ({showMenu, setShowMenu}: Props) => {
    const user = useAuthValue();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

    }, []);

    const logOut = async() => {
        try {
            await signOut(auth);
            setShowMenu(false);
        }catch(err: any) {
            console.log(err.code)
        }
    }

    return (
        <div 
            className={classNames('h-full fixed w-full menuTranslate z-10', 
            showMenu && 'show')}
            onClick={() => setShowMenu(false)}
            ref={menuRef}
            >
            <aside 
                className='w-[200px] bg-white border-r shadow-md flex flex-col h-full pb-5 overflow-y-auto' 
                onClick={(event) => event.stopPropagation()}>
                <div className='px-5 flex justify-between border-b border-b-mainBorder h-[60px] items-center'>
                    <p><span className='text-sm text-gray-600'>Hello</span> {user?.displayName}</p>
                    <button onClick={() => setShowMenu(false)}>
                        <VscChromeClose/>
                    </button>
                </div>
                <div className="flex flex-col mt-5">
                    <NavLink 
                        to='/fitness' 
                        className={({isActive}) => (
                            isActive ? 'bg-theme/5 [&>*]:text-theme' : 'hover:bg-black/5'
                        ) + ' flex items-center py-3 px-5'}
                        onClick={() => setShowMenu(false)}
                    >
                        <IoIosFitness className="text-gray-700"/>
                        <span className="ml-2">Fitness</span>
                    </NavLink>
                    <NavLink 
                        to='/nutrition'
                        className={({isActive}) => (
                            isActive ? 'bg-theme/5 [&>*]:text-theme' : 'hover:bg-black/5'
                        ) + ' flex items-center py-3 px-5'}
                        onClick={() => setShowMenu(false)}
                    >
                        <GiFruitBowl className="text-gray-700"/>
                        <span className="ml-2">Nutrition</span>
                    </NavLink>
                    <NavLink 
                        to='/wellness'
                        className={({isActive}) => (
                            isActive ? 'bg-theme/5 [&>*]:text-theme' : 'hover:bg-black/5'
                        ) + ' flex items-center py-3 px-5'}  
                        onClick={() => setShowMenu(false)}  
                    >
                        <GiPeaceDove className="text-gray-700"/>
                        <span className="ml-2">Wellness</span>
                    </NavLink>
                </div>

                <div className="grow flex flex-col justify-center">
                    <button 
                        onClick={logOut}
                        className="text-left px-5 py-3 flex items-center text-gray-600 hover:text-black
                        hover:bg-black/5">
                            <BiLogOutCircle className="mr-2 text-gray-700"/> Logout</button>
                </div>
            </aside>
        </div>
    )
}

export default MobileMenu