import { useEffect, useState } from "react";

/**
 * Check if the device-width < 768px
 */
export default function IsMobile() {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
        const mediaWatcher = window.matchMedia("(max-width: 768px)")
        setIsMobile(mediaWatcher.matches);

        function updateIsNarrowScreen(e: MediaQueryListEvent) {
            setIsMobile(e.matches);
        }
        
        mediaWatcher.addEventListener('change', updateIsNarrowScreen)

        return function cleanup() {
            mediaWatcher.removeEventListener('change', updateIsNarrowScreen);
        }
    },[])

    return isMobile
}
