import { useContext, FC } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from '../../store/Context'
import { IoLogOut } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';
import IconButton from '../../components/IconButton';
import s from './UserMenu.module.css';

const UserMenu: FC = () => {
  const { store } = useContext(Context);
  const { name } = store.user

  return (
    <div className={s.container}>
      <VscAccount className={s.avatar}/>
      <span className={s.name}>{name}</span>
      <IconButton onClick={() => store.logout()} classNames={s.logOutBtn} aria-label="log out">
        <IoLogOut/>
      </IconButton>
    </div>
  );
}

export default observer(UserMenu)
