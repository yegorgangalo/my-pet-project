import { useContext, FC } from 'react';
import { NavLink } from "react-router-dom";
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import { observer } from "mobx-react-lite";
import { Context } from '../../store/Context'
import UserMenu from '../../components/UserMenu';
import s from './Navigation.module.scss';

interface IswitchIsActive {
  isActive: boolean;
}

const Navigation: FC = () => {
  const { store } = useContext(Context);
  const isLoggedIn = store.isAuth
  const isLoggedInAndActivated = store.isAuth && store.user.isActivated
  const isLoggedInAndNotActivated = store.isAuth && !store.user.isActivated

  const switchIsActive = ({ isActive }: IswitchIsActive) => isActive ? s.activeLink : s.link

  return (<>
    <Box component="header" display="flex" alignItems="center" justifyContent="space-between" minHeight="60px">
      <nav>
        {isLoggedInAndActivated &&
          <NavLink to="/users" className={switchIsActive}>Users</NavLink>}
        {!isLoggedIn && (<>
          <NavLink to="/login" className={switchIsActive}>Log In</NavLink>
          <NavLink to="/register" className={switchIsActive}>Register</NavLink>
        </>)}
        {isLoggedInAndNotActivated && <NavLink to="/activate" className={switchIsActive}>Activate</NavLink>}
      </nav>
      {isLoggedIn && <UserMenu/>}
    </Box>
    <Divider/>
    </>
  );
}

export default observer(Navigation)
