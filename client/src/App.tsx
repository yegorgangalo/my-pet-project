import { LS, ROLES } from "@mandruy/common/const"
import { useEffect } from 'react'
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useForm, FormProvider } from "react-hook-form";
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import Spinner from './components/Spinner'
import Navigation from './components/Navigation'
import { useTypedSelector, useDispatchActions } from 'hooks/useTypedRedux'
const ProfilePage = lazy(() => import('./pages/ProfilePage' /* webpackChunkName: "profilepage" */));
const MainPage = lazy(() => import('./pages/MainPage' /* webpackChunkName: "mainpage" */));
const ActivatePage = lazy(() => import('./pages/ActivatePage' /* webpackChunkName: "activatepage" */));
const UsersPage = lazy(() => import('./pages/UsersPage' /* webpackChunkName: "userspage" */));
const LoginPage = lazy(() => import('./pages/LoginPage' /* webpackChunkName: "loginpage" */));
const RegisterPage = lazy(() => import('./pages/RegisterPage' /* webpackChunkName: "registerpage" */));
const AudioToText = lazy(() => import('./pages/AudioToText' /* webpackChunkName: "audiototextpage" */));

function App() {
  const { checkAuth, setIsLoadedBE } = useDispatchActions()
  const { isLoadedBE, user } = useTypedSelector(state => state.user)
  console.log('user====', user);

  useEffect(() => {
    if (isLoadedBE) {
      return
    }
    if (localStorage.getItem(LS.ACCESS_TOKEN)) {
      checkAuth()
    } else {
      setIsLoadedBE()
    }
  }, [checkAuth, setIsLoadedBE, isLoadedBE])

  const methods = useForm()

  return (<FormProvider {...methods}>
    {!isLoadedBE
      ? <Spinner centerred />
      : (
        <>
          <Navigation />
          <Suspense fallback={<Spinner centerred />}>
            <Routes>
              <Route path="/login" element={<PublicRoute component={<LoginPage />} restricted redirectTo={user?.isActivated ? "/" : "/activate"} />} />
              <Route path="/register" element={<PublicRoute component={<RegisterPage />} restricted redirectTo="/activate" />} />
              <Route path="/activate" element={<PrivateRoute component={<ActivatePage />} noActivation redirectTo={"/users"} />} />
              <Route path="/users" element={<PrivateRoute component={<UsersPage />} allowedRoles={[ROLES.TOURIST]} userRoles={user?.roles} />} />
              <Route path="/audio-to-text" element={<PrivateRoute component={<AudioToText />} allowedRoles={[ROLES.TOURIST]} userRoles={user?.roles} />} />
              <Route path="/profile" element={<PrivateRoute component={<ProfilePage />} />} />
              <Route path="/" element={<PublicRoute component={<MainPage />} />} />
            </Routes>
          </Suspense>
        </>
      )}
  </FormProvider>
  )
}

export default App
