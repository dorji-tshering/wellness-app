import { useEffect, useState } from "react";

type ReturnType = {
    isMobile: boolean
    checkingWidth: boolean
}

/**
 * Check if the device-width < 768px
 */
export default function IsMobile(): ReturnType {
    const [isMobile, setIsMobile] = useState(false);
    const [checkingWidth, setCheckingWidth] = useState(true);
  
    useEffect(() => {
        const mediaWatcher = window.matchMedia("(max-width: 768px)")
        setIsMobile(mediaWatcher.matches);
        setCheckingWidth(false);

        function updateIsNarrowScreen(e: MediaQueryListEvent) {
            setIsMobile(e.matches);
        }
        
        mediaWatcher.addEventListener('change', updateIsNarrowScreen)

        return function cleanup() {
            mediaWatcher.removeEventListener('change', updateIsNarrowScreen);
        }
    },[])

    return { isMobile, checkingWidth }
}
