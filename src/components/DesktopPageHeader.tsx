import React from 'react'

type Props = {
    children: React.ReactNode;
}

const DesktopPageHeader = ({ children }: Props) => {
    return (
        <header className='bg-white/80 py-6 sticky top-0 font-bold text-lg'>
            { children }
        </header>
    )
}

export default DesktopPageHeader;