import IsMobile from "../utils/useMediaQuery";
import MobileHeader from "./MobileHeader";
import DesktopSidebar from "./DesktopSidebar";
import { useAuthValue } from "../utils/authContext";
import MobileMenu from "./MobileMenu";
import { useState } from "react";

type Props = {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const isMobile = IsMobile();
    const user = useAuthValue();

    return (
        <main className="h-full flex flex-col justify-between">
            <MobileMenu showMenu={showMobileMenu} setShowMenu={setShowMobileMenu}/>
            { !user && children }

            { user && isMobile && (
                <div>
                    <MobileHeader setShowMenu={setShowMobileMenu}/>
                    { children }
                </div>  
            ) }

            { user && !isMobile && (
                <div className="flex h-full">
                    <DesktopSidebar/>
                    <div className="overflow-y-auto bg-white">
                        { children }
                    </div>
                </div>
            ) }
        </main>
    )
}

export default Layout