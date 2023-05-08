import { lazy, Suspense } from 'react';
import Home from "./pages/home";
import { Route, Routes } from "react-router-dom";
import { auth } from './firebaseClient';
import { onAuthStateChanged } from "firebase/auth";
import { AuthContextProvider } from "./utils/auth-context";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Layout from "./components/layout";
import Loader from './components/loader';

const Fitness = lazy(() => import('./pages/fitness'));
const Nutrition = lazy(() => import('./pages/nutrition'));
const Wellness = lazy(() => import('./pages/wellness'));
const Login = lazy(() => import('./pages/login'));
const NotFound = lazy(() => import('./pages/not-found'));

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
        console.log('hello')
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setCurrentUser(user); 
                setLoadingUser(false);
            }else {   
                setCurrentUser(null);
                loadingUser && setLoadingUser(false);
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(loadingUser || (!currentUser && window.location.pathname !== '/login')) {
        return <Loader/>
    }

    return (
        <AuthContextProvider value={currentUser}>
            <Layout>
                <Suspense fallback={''}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>      
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/fitness" element={<Fitness/>}/>
                        <Route path="/nutrition" element={<Nutrition/>}/>
                        <Route path="/wellness" element={<Wellness/>}/>
                        <Route path='*' element={<NotFound/>}/>
                    </Routes>
                </Suspense>
            </Layout>
        </AuthContextProvider>   
    );
}

export default App;
