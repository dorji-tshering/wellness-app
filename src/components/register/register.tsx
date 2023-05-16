import { FORM_ERROR } from 'final-form';
import { useNavigate } from 'react-router-dom';
import { Props, RegistrationProps } from '../../model/register';
import { registerUserWithEmailAndPassword } from '../../services/facade.service';
import AuthForm from '../auth-form/auth-form';
 
const Register = ({setOnSignin}: Props) => {
  const navigate = useNavigate();

  const handleRegistration = async({email, password}: RegistrationProps) => {
      try {
          await registerUserWithEmailAndPassword( email, password);
          navigate('/');
      }catch(err: any) {
          return { [FORM_ERROR]: err.code };
      }
  }

  return (
    <AuthForm formHandler={handleRegistration} formName='register' buttonText='Register' setOnSignin={setOnSignin}/>       
  )
}

export default Register;