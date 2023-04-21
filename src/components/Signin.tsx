import { FormEvent, useRef, useState } from 'react';
import { emailValidate, passwordValidate } from '../utils/formValidate';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseClient';
import { useNavigate } from 'react-router-dom';

type Props = {
    setOnSignin: React.Dispatch<React.SetStateAction<boolean>>
}

const Signin = ({setOnSignin}: Props) => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const [signingIn, setSigningIn] = useState(false);
    const [inputError, setInputError] = useState({
        email: '',
        password: '',
    });
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const submitButtonRef = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate();

    const handleSignin = async(event: FormEvent) => {
        event.preventDefault();
        const validEmail = emailValidate(formData.email, setInputError);
        const validPassword = passwordValidate(formData.password, setInputError);

        if(validEmail && validPassword && submitButtonRef.current) {
            setSigningIn(true);
            submitButtonRef.current.disabled = true;
            try{
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                setSigningIn(false);
                navigate('/');
            }catch(err: any) {
                setLoginError(err.code);
                setSigningIn(false);
                submitButtonRef.current.disabled = false;
                return;
            }
        }else return;
    }

    return (
        <form onSubmit={handleSignin}
            className='flex items-center flex-col'
            noValidate
        >
            <h2 className='mb-4 font-bold'>Sign up</h2>
            {
                loginError && (
                    <p className='text-sm text-red-700 mb-4 bg-red-100 w-full rounded-[4px]
                    py-1 text-center'>{loginError}</p>
                )
            }
            <span className='mb-4 w-full md:w-[80%] md:mx-auto'>
                <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder='Your email'
                    className='border border-mainBorder outline-none rounded-[4px] px-3 py-2 w-full'
                />
                { inputError.email && <p className='text-sm text-red-700'>{inputError.email}</p> }
            </span>

            <span className='mb-5 w-full md:w-[80%] md:mx-auto'>
                <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder='Your password'
                    className='border border-mainBorder outline-none rounded-[4px] px-3 py-2 w-full'
                />
                { inputError.password && <p className='text-sm text-red-700'>{inputError.password}</p> }
            </span>
            <button 
                ref={submitButtonRef}
                type='submit'
                className='bg-theme text-white rounded-full px-4 py-1 w-full md:w-[80%] mb-3'
                >{ signingIn ? 'Signing in...' : 'Signin' }</button>
            <button 
                type='button'
                onClick={() => setOnSignin(false)} 
                className='text-theme hover:underline'>Register</button>
        </form>
    )
}

export default Signin