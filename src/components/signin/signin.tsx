import { FORM_ERROR } from 'final-form';
import { useNavigate } from 'react-router-dom';
import { Props } from '../../model/signin';
import { loginWithEmailAndPassword } from '../../services/facade.service';
import AuthForm from '../auth-form/auth-form';

const Signin = ({setOnSignin}: Props) => {
  const navigate = useNavigate();

  const handleSignin = async(values: { email: string, password: string }) => {
      try{
          await loginWithEmailAndPassword(values.email, values.password);
          navigate('/');
      }catch(err: any) {
          return { [FORM_ERROR]: err.code };
      }
  }
  return (
    <AuthForm formHandler={handleSignin} formName='login' buttonText='Login' setOnSignin={setOnSignin}/>       
  )
}

export default Signin;