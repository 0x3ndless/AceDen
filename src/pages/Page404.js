import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varFade } from '../components/animate';
import Image from '../components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="404 Page Not Found" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varFade().in}>
              <Typography variant="h3" paragraph>
              Lost in the Digital Wilderness!
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            Oops! The page you're seeking has vanished into the digital abyss. Embrace the unexpected and explore new online horizons!
            </Typography>

            <m.div animate={{ y: [-20, 0, -20] }} transition={{ duration: 4, repeat: Infinity }}>
              <Image src="/assets/illustration/portal.gif"/>
            </m.div>

            <Button to="/" sx={{mt: 2}} variant="outlined" component={RouterLink}>
              Go to Home
            </Button>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
