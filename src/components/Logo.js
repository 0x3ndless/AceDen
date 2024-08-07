import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
//css from home
import '../pages/home/home.css';
// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {


  const logo = (
    <Box sx={{ flexGrow: 1, width: 35, height: 35, display: 'flex', ...sx  }}>
     <Box component="img"src='/favicon/logo.png'alt="Aceden"/>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }
  return <RouterLink to="/" style={{ textDecoration: 'none'}}>{logo}</RouterLink>;
}
