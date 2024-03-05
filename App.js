import React, { Suspense, useContext, useEffect, useState  } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './config/routes';
import {Loader, MainLayout} from './intefaces/layouts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosContext, AuthContext } from './context';
import { BallTriangle } from 'react-loader-spinner';
import './App.scss';

export default function App() {
  const { loading } = useContext(AxiosContext);
  const { getToken, token } = useContext(AuthContext);
  const [mount, setMount] = useState(false);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    setPages();
  }, [token]);

  const setPages = async () => {
    const getMenu = routes.map((route, index) => {
      if (route.isAdmin) {
        return (route.component) ? (
          <Route 
            key={index}
            path={route.path}
            exact={route.exact}
            name={route.name}
            element={route.auth ? getToken() ? route.component : <Navigate to='/admin/login' state={{ from: route.path }} /> : route.component}
          />
        ) : null;
      } else {
        return (route.component) ? (
          <Route 
            key={index}
            path={route.path}
            exact={route.exact}
            name={route.name}
            element={route.auth ? getToken() ? route.component : <Navigate to='/auth/login' state={{ from: route.path }} /> : route.component}
          />
        ) : null;
      }        
    });
    setMenu(getMenu);
    setMount(true);
  };

  const renderView = () => {
    if (mount) {
      return (
        <MainLayout>
            <Routes>
              {menu}
            </Routes>
          </MainLayout>
      );
    }      
  };
  
  return (
    <Suspense fallback={<Loader/>}>
      { loading && <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.65)',
        zIndex: 9999
      }}>
        <BallTriangle color="#00BFFF" height={80} width={80} ariaLabel="loading-indicator" />
      </div> }
      <ToastContainer 
        hideProgressBar={true}
        autoClose={3500}
      />
        {renderView()}
    </Suspense>
  );
}