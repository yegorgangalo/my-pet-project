import { FC, useState, MouseEvent } from 'react';
import { NavLink } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Logout from '@mui/icons-material/Logout';
import { useTypedSelector, useOperations } from 'hooks/useTypedRedux'

const UserMenu: FC = () => {
  const { user } = useTypedSelector(state => state.user)
  const { logout } = useOperations()

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
        <Avatar alt="avatar" src={user?.avatar} />
      </IconButton>
      <IconButton
        onClick={() => logout()}
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
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

export default UserMenu
