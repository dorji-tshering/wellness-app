import { updateProfile } from "firebase/auth";
import { useAuthValue } from "../utils/authContext";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

const Home = () => {
    const [settingName, setSettingName] = useState(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [modalOn, setModalOn] = useState(false);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const spaceRef = useRef(0);
    const user = useAuthValue();

    useEffect(() => {
        if(user && !user.displayName) {
            setModalOn(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateDisplayName = async(event: FormEvent) => {
        event.preventDefault();

        if(displayName.length >= 1 && submitButtonRef.current && user) {
            submitButtonRef.current.disabled = true;
            setSettingName(true);

            try {
                await updateProfile(user, {
                    displayName: displayName
                });
                window.location.reload();
            }catch(err: any) {
                console.log(err.code)
                submitButtonRef.current.disabled = false;
                setSettingName(false);
            }
        }
    }

    // allow only single space between characters/words
    const checkDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
        let lastChar = e.target.value.charAt(e.target.value.length - 1);

        // disallow first character to be space
        if(lastChar === ' ' && e.target.value.length === 1) {
            setDisplayName('');
            return;
        }

        if(lastChar === ' ') {
            if(displayName?.charAt(displayName.length - 1) === '.') {
                spaceRef.current = 0;
            }
            if(spaceRef.current === 1) {
                setDisplayName(e.target.value.slice(0, -1));   
            }else {
                spaceRef.current = 1;
                setDisplayName(e.target.value);
            }
        }else {
            if(spaceRef.current === 1) {
                spaceRef.current = 0;
            }
            setDisplayName(e.target.value);
        }
    }

    return (
        <>
            { modalOn && (
                <div className="bg-black/30 fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                    <form 
                        onSubmit={updateDisplayName}
                        className="bg-white p-5 rounded-md shadow-md flex flex-col items-center">
                        <h1 className="mb-3 font-medium">Display Name</h1>
                        <input 
                            type="text"
                            value={displayName}
                            onChange={checkDisplayName}
                            placeholder="Your name"
                            className="border border-mainBorder outline-none rounded-[4px] px-2 py-1" />
                        <span className="mb-3 text-xs mt-1 text-gray-500">Atleast a character expected</span>
                        <button 
                            type="submit"
                            ref={submitButtonRef}
                            className="bg-theme text-white rounded-full px-4 py-1">
                                { settingName ? 'Just a minute..' : 'Set' }
                            </button>
                    </form>
                </div>
            ) }

            
        </>
    )
}

export default Home