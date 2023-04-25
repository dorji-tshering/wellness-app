import Login from "./pages/Login";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { auth } from './firebaseClient';
import { onAuthStateChanged } from "firebase/auth";
import { AuthContextProvider } from "./utils/authContext";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Fitness from "./pages/Fitness";
import Nutrition from "./pages/Nutrition";
import Wellness from "./pages/Wellness";
import Layout from "./components/Layout";
import Loader from './components/Loader';

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        if(!loadingUser && !currentUser && window.location.pathname !== '/login') {
            navigate('/login');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingUser, currentUser]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setCurrentUser(user);
                setLoadingUser(false);
            }else {
                setCurrentUser(null);
                setLoadingUser(false);
            }
        })
    }, []);

    if(loadingUser) {
        return <Loader/>
    }

    return (
        <AuthContextProvider value={currentUser}>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>}/>      
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/fitness" element={<Fitness/>}/>
                    <Route path="/nutrition" element={<Nutrition/>}/>
                    <Route path="/wellness" element={<Wellness/>}/>
                </Routes>
            </Layout>
        </AuthContextProvider>   
    );
}

export default App;
