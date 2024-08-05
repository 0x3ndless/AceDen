import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

import ProgressBar from './ProgressBar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

LoadingScreen.propTypes = {
  isDashboard: PropTypes.bool,
};

export default function LoadingScreen({ isDashboard, ...other }) {
  return (
    <>
      <ProgressBar />

      {!isDashboard && (
        <RootStyle {...other}>
          <m.div sx={{
              width: 100,
              height: 100,
              position: 'absolute'
            }}>
            <CircularProgress sx={{ width: 64, height: 64 }}/>
          </m.div>

       
        </RootStyle>
      )}
    </>
  );
}
