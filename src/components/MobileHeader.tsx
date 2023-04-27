import { SetStateAction } from 'react';
import { MdHealthAndSafety } from 'react-icons/md';
import { RiMenu3Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';

type Props = {
    setShowMenu: React.Dispatch<SetStateAction<boolean>>
}

const MobileHeader = ({setShowMenu}: Props) => {
    return (
        <div className='bg-blue-50 flex justify-between items-center h-[60px] px-3 fixed top-0 right-0 left-0
        shadow-sm z-10'>
            <div>
                <Link to='/'><MdHealthAndSafety className='text-theme' size={40}/></Link>
            </div>
            <button onClick={() => setShowMenu(true)}>
                <RiMenu3Line size={24}/>
            </button>
        </div>
    )
}

export default MobileHeader