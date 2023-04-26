import IsMobile from "../utils/useMediaQuery";
import MobileHeader from "./MobileHeader";
import DesktopSidebar from "./DesktopSidebar";
import { useAuthValue } from "../utils/authContext";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import { NotificationContextProvider } from "../utils/notificationContext";
import Notification from "./Notification";

type Props = {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [notification, setNotification] = useState('');
    const isMobile = IsMobile();
    const user = useAuthValue();

    return (
        <NotificationContextProvider value={{
            notification,
            setNotification
        }}>
            <main className="h-full flex flex-col justify-between">
                { notification && <Notification/> }
                <MobileMenu showMenu={showMobileMenu} setShowMenu={setShowMobileMenu}/>
                { !user && children }

                { user && isMobile && (
                    <div className="flex flex-col">
                        <MobileHeader setShowMenu={setShowMobileMenu}/>
                        <div className="h-[60px]"/>
                        <div className="bg-white grow min-h-screen px-4 pb-20">
                            { children }
                        </div>
                    </div>  
                ) }

                { user && !isMobile && (
                    <div className="flex h-full">
                        <DesktopSidebar/>
                        <div className="overflow-y-auto bg-white grow ml-3 shadow-md pb-20">
                            <div className='px-4 py-6 md:px-10 md:pb-8 lg:px-20 lg:pb-16 xl:px-30 xl:pb-24'>
                            { children }
                            </div>
                        </div>
                    </div>
                ) }
            </main>
        </NotificationContextProvider>
    )
}

export default Layout