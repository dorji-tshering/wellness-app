import Signin from "../components/Signin";
import Register from "../components/Register";
import { useEffect, useState } from "react";
import { useAuthValue } from "../utils/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [onSignin, setOnSignin] = useState(true);
    const navigate = useNavigate();
    const user = useAuthValue();

    useEffect(() => {
        if(user) {
            navigate('/');
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);   

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