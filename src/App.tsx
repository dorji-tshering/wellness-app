import { Suspense } from 'react';
import { auth } from './firebaseClient';
import { onAuthStateChanged } from "firebase/auth";
import { AuthContextProvider } from "./hooks/use-auth-context";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/layout/layout";
import Loader from './components/loader/loader';
import Navigation from './navigation/navigation';

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [loadingUser, setLoadingUser] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if(!loadingUser && !currentUser && window.location.pathname !== '/login') {
            navigate('/login');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingUser, currentUser, location.pathname]);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if(user) {
              setCurrentUser(user); 
              setLoadingUser(false);
          }else {   
              setCurrentUser(null);
              loadingUser && setLoadingUser(false);
          }
      })
      return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(loadingUser || (!currentUser && window.location.pathname !== '/login')) {
        return <Loader/>
    }

    return (
      <AuthContextProvider value={currentUser}>
          <Layout>
              <Suspense fallback={
                <div className="w-full relative h-[200px]"><Loader/></div>
              }>
                  <Navigation/>
              </Suspense>
          </Layout>
      </AuthContextProvider>   
    );
}

export default App;
