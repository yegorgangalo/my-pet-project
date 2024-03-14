import { FC } from 'react';
import { NavLink } from "react-router-dom";
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import { useTypedSelector } from 'hooks/useTypedRedux'
import UserMenu from 'components/UserMenu';
import s from './Navigation.module.scss';

interface IswitchIsActive {
  isActive: boolean;
}

const Navigation: FC = () => {
  const { isAuth, user } = useTypedSelector(state => state.user)
  const isLoggedIn = isAuth
  const isLoggedInAndActivated = isAuth && user?.isActivated
  const isLoggedInAndNotActivated = isAuth && !user?.isActivated

  const switchIsActive = ({ isActive }: IswitchIsActive) => isActive ? s.activeLink : s.link

  return (<>
    <Box component="header" display="flex" alignItems="center" justifyContent="space-between" minHeight="60px">
      <nav>
        {isLoggedInAndActivated && <>
          <NavLink to="/users" className={switchIsActive}>Users</NavLink>
          <NavLink to="/audio-to-text" className={switchIsActive}>Audio</NavLink>
        </>}
        {!isLoggedIn && (<>
          <NavLink to="/login" className={switchIsActive}>Log In</NavLink>
          <NavLink to="/register" className={switchIsActive}>Register</NavLink>
        </>)}
        {isLoggedInAndNotActivated && <NavLink to="/activate" className={switchIsActive}>Activate</NavLink>}
      </nav>
      {isLoggedIn && <UserMenu />}
    </Box>
    <Divider />
  </>
  );
}

export default Navigation
