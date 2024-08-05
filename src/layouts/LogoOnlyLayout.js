import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// components
import { Stack} from '@mui/material';
import MainHeader from './main/MainHeader';



const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  },
  display: 'flex',
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: '10px',
}));




// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {

  return (
    <>
      <HeaderStyle>
      <>
      <Stack direction="row" spacing={1}>
        <MainHeader />
      </Stack>
      </>
      
      </HeaderStyle>
      <Outlet />
    </>
  );
}
