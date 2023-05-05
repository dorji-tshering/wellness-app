export type Props = {
    value: {
        notification: string;
        setNotification: React.Dispatch<React.SetStateAction<string>>
    };
    children: React.ReactNode;
}