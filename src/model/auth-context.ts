import { User } from "firebase/auth";

export type Props = {
    value: User | null;
    children: React.ReactNode;
}