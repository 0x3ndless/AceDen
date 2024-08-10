import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useAccount } from 'wagmi'
// hooks
import useOffSetTop from '../hooks/useOffSetTop';
import useResponsive from '../hooks/useResponsive';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Button } from '@mui/material';

import { HEADER, NAVBAR } from '../config';

import MenuDesktop from './main//MenuDesktop';
import navConfig from './main/MenuConfig';
// components
import Logo from '../components/Logo';
import ConnectAuthorize from '../pages/authentication/ConnectAuthorize';
import Connect from '../pages/authentication/Connect';
import AccountPopover from './dashboard/header/AccountPopover';
// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  },
  display: 'flex',
  justifyContent: 'space-between', 
  alignItems: 'center'
}));


const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));



// ----------------------------------------------------------------------

export default function UserLayout() {

  const { isConnected } = useAccount();
  const accessTokenExists = localStorage.getItem('access_token') !== null;

  
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const isDesktop = useResponsive('up', 'md');

  return (
    <Box
    sx={{
      display: { lg: 'flex' },
      minHeight: { lg: 1 },
    }}
  >
      <HeaderStyle>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        {!accessTokenExists && isConnected ? 
            <ConnectAuthorize /> : !accessTokenExists || (!isConnected) ? <Connect /> : null
           }

          {isConnected && (localStorage.getItem('access_token') !== null) ?
             isDesktop && <MenuDesktop isOffset={isOffset} navConfig={navConfig} />
              : null
           }
        

          {isConnected && (localStorage.getItem('access_token') !== null) ?
            <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
              <Button component={RouterLink} to='/bet/create' variant='outlined'>Create Bet</Button>
              <AccountPopover />
            </Stack> : null
          }       
      </HeaderStyle>

      <MainStyle>
        <Outlet />
      </MainStyle>

    </Box>
  );
}
