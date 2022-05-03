import { useContext, FC, useState, MouseEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Logout from '@mui/icons-material/Logout';
import { Context } from '../../store/Context'

const UserMenu: FC = () => {
  const { store } = useContext(Context);
  const { avatar } = store.user

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center" >
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar alt="avatar" src={avatar} />
      </IconButton>
      <IconButton
        onClick={() => store.logout()}
        aria-label="log out"
      >
        <Logout />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <NavLink to="/profile" style={({ isActive }) => isActive ? ({ color: "grey"}) : ({color: "inherit"})}>Profile</NavLink>
        </MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={() => store.logout()}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

export default observer(UserMenu)
