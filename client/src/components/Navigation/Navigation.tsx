import { useContext, FC } from 'react';
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from '../../store/Context'
import UserMenu from '../../components/UserMenu';
import s from './Navigation.module.scss';

 const Navigation: FC = () => {
  const { store } = useContext(Context);
  const isLoggedIn = store.isAuth
  const isLoggedInAndActivated = store.isAuth && store.user.isActivated
   const isLoggedInAndNotActivated = store.isAuth && !store.user.isActivated
  return (
    <header className={s.header}>
      <nav>
        {isLoggedInAndActivated &&
          <NavLink to="/users" className={({ isActive }) => isActive ? s.activeLink : s.link}>Users</NavLink>}
        {!isLoggedIn && (<>
          <NavLink to="/login" className={({ isActive }) => isActive ? s.activeLink : s.link }>Log In</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? s.activeLink : s.link }>Register</NavLink>
        </>)}
        {isLoggedInAndNotActivated && <NavLink to="/activate" className={({ isActive }) => isActive ? s.activeLink : s.link}>Activate</NavLink>}
      </nav>
      {isLoggedIn && <UserMenu/>}
    </header>
  );
}

export default observer(Navigation)
