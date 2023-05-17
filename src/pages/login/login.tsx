import Signin from '../../components/signin/signin';
import Register from "../../components/register/register";
import { useEffect, useState } from "react";
import { useAuthValue } from "../../hooks/use-auth-context";
import { useNavigate } from "react-router-dom";
import Loader from '../../components/loader/loader';

const Login = () => {
    const [onSignin, setOnSignin] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();
    const user = useAuthValue();

    useEffect(() => {
        if(user) {
            navigate('/');
        } 
        setLoadingUser(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);   

    if(loadingUser) {
      return (
          <div className="w-full relative h-[200px]">
              <Loader/>
          </div>
      )
  }

    return (
        <div className="grow">
            <div className="h-full w-full overflow-y-auto flex flex-col justify-center items-center p-5">
                <div className="bg-white shadow-md rounded-md p-5 w-full max-w-[400px]">
                    {
                        onSignin ? 
                        <Signin setOnSignin={setOnSignin}/> 
                        :  
                        <Register setOnSignin={setOnSignin}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Login;