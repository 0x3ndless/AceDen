import React from 'react';
import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Stack, Typography } from '@mui/material';
import './home.css';
import { MotionViewport, varFade } from '../../components/animate';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
}));

const emojis = [
  "🎲", "💹", "📈", "🤑", "🚀", "📉", "👥", "🕒", "🏆", "🔄"
];

const shuffleArray = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};


export default function HomeBanner() {

  const shuffledEmojis = shuffleArray([...emojis]);

  return (
    <RootStyle>

      <ul className="emoji">
        {shuffledEmojis.map((emoji, index) => (
          <li key={index} style={{ animationDuration: `${10 + Math.random() * 10}s` }}>
            {emoji}
          </li>
        ))}
      </ul>

      <Container component={MotionViewport}>
        <Box sx={{ textAlign: 'center', mb: 7, mt: 4 }}>
          <m.div variants={varFade().inUp}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <m.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 4, repeat: Infinity }} 
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    mb: 0,
                    fontSize: { xs: '2.5rem', sm: '4rem', md: '5rem', lg: '6rem' }, 
                    fontWeight: 'bold',
                  }}
                >
                  <span className="title_keyword2">AceDen</span>
                </Typography>
               
              </m.div>
            </Box>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography
              sx={{
                mx: 'auto',
                maxWidth: 630,
                mt: 2.5,
              }}
            >
              Place <span className="title_keyword2" style={{ fontWeight: 'bold' }}>P2P bets</span> on cryptocurrency price movements and see if you can <span className="title_keyword2" style={{ fontWeight: 'bold' }}>predict</span> the market's next move!
            </Typography>
          </m.div>

          <Stack sx={{ mt: 3.5 }}>
            <m.div variants={varFade().inUp} sx={{ mb: 1 }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                Powered by  
              </Typography>
            </m.div>

            <Stack direction="row" justifyContent="center" spacing={3} sx={{mt: 2 }} >
              <m.img variants={varFade().inUp} src="/icons/base-chain.svg" width={60} />
              <m.img variants={varFade().inUp} src="/icons/pyth.png" width={60} />    
              <m.img variants={varFade().inUp} src="/icons/blockscout.svg" width={80} />       
            </Stack>
          </Stack>
        </Box>
      </Container>
    </RootStyle>
  );
}