import { Field, Form } from "react-final-form"
import { emailValidate, passwordValidate } from "../../utils/form-validate"
import { AuthFormProps } from "../../model/auth-form";

const AuthForm = ({ formName, buttonText, formHandler, setOnSignin }: AuthFormProps) => {
  return (
      <Form  
        onSubmit={formHandler}
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
                <h2 className='mb-4 text-lg font-bold'>{ formName.toUpperCase() }</h2>
                {
                    submitError && (
                        <p className='text-xs text-red-700 mb-4 bg-red-100 w-full rounded-[4px]
                        py-1 text-center'>{submitError}</p>
                    )
                }
                
                <Field name='email' type='email' placeholder='Your email' validate={value => emailValidate(value)}>
                    {({input, meta, placeholder}) => (
                        <span className='mb-4 w-full md:w-[80%] md:mx-auto'>
                            <input 
                                {...input}
                                placeholder={placeholder}
                                className='border border-mainBorder outline-none rounded-[4px] px-3 py-2 w-full'
                            />
                            { (meta.error || meta.submitError) && meta.touched && (
                                <p className='text-xs text-red-700'>{meta.error || meta.submitError}</p>
                            ) }
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
                            ) }
                        </span>
                    )}
                </Field>
                        
                <button 
                    type='submit'
                    disabled={submitting}
                    className='bg-theme text-white rounded-full px-4 py-2 w-full md:w-[80%] mb-3 hover:bg-themeHover'
                    >{ submitting ? '. . .' : buttonText }</button>
                <button 
                    type='button'
                    onClick={() => formName === 'register' ? setOnSignin(true) : setOnSignin(false)} 
                    className='text-theme hover:underline'>{ formName === 'register' ? 'Signin' : 'Register' }</button>
            </form>
        )}
      </Form>
  )
}

export default AuthForm;