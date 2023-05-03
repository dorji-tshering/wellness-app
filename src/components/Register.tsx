import { emailValidate, passwordValidate } from '../utils/formValidate';
import { auth } from '../firebaseClient';
import { FORM_ERROR } from 'final-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

type Props = {
    setOnSignin: React.Dispatch<React.SetStateAction<boolean>>
}

type RegistrationProps = {
    email: string
    password: string
}

const Register = ({setOnSignin}: Props) => {
    const navigate = useNavigate();

    const handleRegistration = async({email, password}: RegistrationProps) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        }catch(err: any) {
            return { [FORM_ERROR]: err.code };
        }
    }

    return (
        <>
            <Form onSubmit={handleRegistration}
                    validate={values => {
                    const errors: any = {};
                    if(!values.email) {
                        errors.email = 'Email is required';
                    }
                    if(!values.password || !values.password.trim()) {
                        errors.password = "You can't have space as passwords";
                    }
                    return errors;
                }}
                >
                {({ handleSubmit, submitError, submitting }) => (
                    <form onSubmit={handleSubmit}
                        className='flex items-center flex-col'
                        >
                        <h2 className='mb-4 text-lg font-bold'>REGISTER</h2>
                        {
                            submitError && (
                                <p className='text-xs text-red-700 mb-4 bg-red-100 w-full rounded-[4px]
                                py-1 text-center'>{submitError}</p>
                            )
                        }
                        
                        <Field name='email' type='email' placeholder='Your email' validate={value => emailValidate(value, true)}>
                            {({input, meta, placeholder}) => (
                                <span className='mb-4 w-full md:w-[80%] md:mx-auto'>
                                    <input 
                                        {...input}
                                        placeholder={placeholder}
                                        className='border border-mainBorder outline-none rounded-[4px] px-3 py-2 w-full'
                                    />
                                    { (meta.error || meta.submitError) && meta.touched && (
                                        <p className='text-xs text-red-700'>{meta.error || meta.submitError}</p>
                                    )}
                                </span>
                            )}
                        </Field>

                        <Field name='password' type='password' placeholder='Your password' validate={value => passwordValidate(value)}>
                            {({input, meta, placeholder}) => (
                                <span className='mb-4 w-full md:w-[80%] md:mx-auto'>
                                    <input 
                                        {...input}
                                        placeholder={placeholder}
                                        className='border border-mainBorder outline-none rounded-[4px] px-3 py-2 w-full'
                                    />
                                    { (meta.error || meta.submitError) && meta.touched && (
                                        <p className='text-xs text-red-700'>{meta.error || meta.submitError}</p> 
                                    )}
                                </span>
                            )}
                        </Field>
                                
                        <button 
                            type='submit'
                            disabled={submitting}
                            className='bg-theme text-white rounded-full px-4 py-2 w-full md:w-[80%] mb-3 hover:bg-themeHover'
                            >{ submitting ? '. . .' : 'Register' }</button>
                        <button 
                            type='button'
                            onClick={() => setOnSignin(true)} 
                            className='text-theme hover:underline'>Signin</button>
                    </form>
                )}
            </Form>
        </>
    )
}

export default Register