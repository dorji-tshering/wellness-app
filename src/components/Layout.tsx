import IsMobile from "../utils/useMediaQuery";
import MobileHeader from "./MobileHeader";
import DesktopSidebar from "./DesktopSidebar";
import { useAuthValue } from "../utils/authContext";

type Props = {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const isMobile = IsMobile();
    const user = useAuthValue();

    return (
        <main className="h-full flex flex-col justify-between">
            { !user && children }

            { user && isMobile && (
                <div>
                    <MobileHeader/>
                    { children }
                </div>  
            ) }

            { user && !isMobile && (
                <div className="flex h-full">
                    <DesktopSidebar/>
                    <div className="overflow-y-auto">
                        { children }
                    </div>
                </div>
            ) }
        </main>
    )
}

export default Layout