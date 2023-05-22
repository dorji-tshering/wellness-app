import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoIosFitness } from 'react-icons/io';
import { GiFruitBowl, GiPeaceDove } from 'react-icons/gi';
import { VscChromeClose } from 'react-icons/vsc';
import { useAuthValue } from '../../hooks/use-auth-context';
import { Props } from '../../model/mobile-menu';
import { logOut } from '../../services/facade.service';
import { resetAll, useAppDispatch } from '../../state/hooks';

const MobileMenu = ({showMenu, setShowMenu}: Props) => {
    const user = useAuthValue();
    const dispatch = useAppDispatch();

    const logOutCurrentUser = async() => {
        try {
            await logOut();
            setShowMenu(false);
            dispatch(resetAll());
        }catch(err: any) {
            console.log(err.code)
        }
    }

    return (
        <div>
            <div
              className={classNames('fixed w-full z-40 bg-black/50 transition-opacity duration-500', 
              showMenu ? 'h-full opacity-100' : 'overflow-hidden h-0 opacity-0')}
              onClick={() => setShowMenu(false)}
            />
            <aside 
                className={classNames('w-[200px] fixed left-0 bg-white border-r shadow-md flex flex-col h-full pb-5 overflow-y-auto',
                showMenu ? 'translate-x-0' : '-translate-x-[120%]',
                'transition-transform duration-[200ms] ease-in-out z-50')} 
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
                        onClick={logOutCurrentUser}
                        className="text-left px-5 py-3 flex items-center text-gray-600 hover:text-black
                        hover:bg-black/5">
                            <BiLogOutCircle className="mr-2 text-gray-700"/> Logout</button>
                </div>
            </aside>
        </div>
    )
}

export default MobileMenu