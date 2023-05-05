import { SetStateAction } from "react";

export type Props = {
    showMenu: boolean;
    setShowMenu: React.Dispatch<SetStateAction<boolean>>
}