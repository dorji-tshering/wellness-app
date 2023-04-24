import { createContext, useContext, SetStateAction } from 'react';

type Props = {
    value: {
        notification: string;
        setNotification: React.Dispatch<SetStateAction<string>>
    };
    children: React.ReactNode;
}

const NotificationContext = createContext<Props['value'] | null>(null);

export const NotificationContextProvider = ({ value, children }: Props) => {
    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    return useContext(NotificationContext);
}