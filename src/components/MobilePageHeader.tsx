import React from 'react'

type Props = {
    children: React.ReactNode;
}

const MobilePageHeader = ({children}: Props) => {
    return (
        <header className='py-5 font-bold'>{ children }</header>
    )
}

export default MobilePageHeader