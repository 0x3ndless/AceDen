import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
//wagmi
import { useDisconnect,} from 'wagmi'
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar } from '@mui/material';
// components
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/Iconify';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getUserData } from '../../../redux/features/contractSlice';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    linkTo: '/profile',
  },
  {
    label: 'Explore',
    linkTo: '/explore',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const { disconnect } = useDisconnect()

  const dispatch = useDispatch();
  const { loadingUser, userData } = useSelector((state) => ({...state.app}));
  
  function disconnected () {
      disconnect();
      localStorage.clear();
  }

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };


  const fetchUser = () => {
    dispatch(getUserData());
  }

  useEffect(() => {
      fetchUser();
  }, []);

  return (
    <>
    
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
       <Avatar sx={{ border: '1px dotted', borderColor: 'text.secondary', background: 'transparent', borderRadius: '50%' }}><Iconify icon={'streamline-emojis:cat-face'} /></Avatar>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle2" noWrap sx={{textTransform: 'capitalize'}}>
          {userData && userData[0] && userData[0].username !== null && userData[0].username !== '' ? (
            loadingUser ? (
              <>...</>
            ) : (
              userData[0].username
            )
          ) : (
            <>Unnamed</>
          )}
        </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData && userData[0] && userData[0].wallet}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} onClick={handleClose} component={RouterLink}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ m: 1, color: '#ff3333' }} onClick={disconnected}>Disconnect</MenuItem>
      </MenuPopover>
    </>
  );
}