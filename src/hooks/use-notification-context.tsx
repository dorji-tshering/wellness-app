import { createContext, useContext } from 'react';
import { Props } from '../model/notification-context';

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