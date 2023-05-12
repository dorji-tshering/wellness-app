import { Props } from "../../model/mobile-page-header";

const MobilePageHeader = ({children}: Props) => {
    return (
        <header className='py-5 font-bold'>{ children }</header>
    )
}

export default MobilePageHeader