import { FormEvent, useRef, useState } from 'react';
import { emailValidate, passwordValidate } from '../utils/formValidate';
import { auth } from '../firebaseClient';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

type Props = {
    setOnSignin: React.Dispatch<React.SetStateAction<boolean>>
}

const Register = ({setOnSignin}: Props) => {
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);
    const [inputError, setInputError] = useState({
        email: '',
        password: '',
    });
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    const handleRegistration = async(event: FormEvent) => {
        event.preventDefault();
        const validEmail = emailValidate(formData.email, setInputError, true);
        const validPassword = passwordValidate(formData.password, setInputError);

        if(validEmail && validPassword && submitButtonRef.current) {
            setRegistering(true);
            submitButtonRef.current.disabled  = true;

            try {
                await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                setRegistering(false);
                navigate('/');
            }catch(err: any) {
                setRegisterError(err.code);
                setRegistering(false);
                submitButtonRef.current.disabled = false;
                return;
            }
        }else return;
    }

    

    return (
        <>
            <form onSubmit={handleRegistration}
                className='flex items-center flex-col'
                noValidate
            >
                <h2 className='mb-4 font-bold'>Register</h2>
                {
                    registerError && (
                        <p className='text-sm text-red-700 mb-4 bg-red-100 w-full rounded-[4px]
                            py-1 text-center'>{registerError}</p>
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
                    className='bg-theme text-white text-sm rounded-full px-4 py-2 w-full md:w-[80%] mb-3 hover:bg-themeHover'>
                    { registering ? 'Registering...' : 'Register' }
                </button>
                <button 
                    type='button'
                    onClick={() => setOnSignin(true)} className='text-theme hover:underline'>Signin</button>
            </form>
        </>
    )
}

export default Register