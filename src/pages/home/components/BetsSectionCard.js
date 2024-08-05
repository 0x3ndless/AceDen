import { m } from 'framer-motion';
import { useRef } from 'react';
import Slider from 'react-slick';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Container, Typography } from '@mui/material';
// components
import Image from '../../../components/Image';
import { MotionViewport, varFade } from '../../../components/animate';
import { CarouselArrows } from '../../../components/carousel';
import useResponsive from '../../../hooks/useResponsive';
// ----------------------------------------------------------------------

const AceDenCards = [
  {
    id: 1,
    name: 'Omnichain Flexibility',
    image: '/assets/illustration/omnichain.png',
  },
  {
    id: 2,
    name: 'No-code Tools',
    image: '/assets/illustration/no-code.png',
  },
  {
    id: 3,
    name: 'Fun Mini Games',
    image: '/assets/illustration/mini-games.png',
  },
  {
    id: 4,
    name: 'ONFT Marketplace',
    image: '/assets/illustration/onft-market.png',
  },
  {
    id: 5,
    name: 'Real Utility',
    image: '/assets/illustration/real-utility.png',
  },
]

export default function BetsSectionCard() {
  const carouselRef = useRef(null);
  const isDesktop = useResponsive('up', 'lg');

  const theme = useTheme();

  const settings = {
    arrows: false,
    slidesToShow: 4,
    infinite: false,
    centerPadding: '0px',
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3.5 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2.5 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1.5 },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Container component={MotionViewport} sx={{ pb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
          DISCOVER THE PURPOSE
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h3" sx={{mb: 2}}><span className="title_keyword2">Why AceDen?</span></Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography sx={{ mx: 'auto', maxWidth: 630, color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'common.white'), }} >
          Explore the unique features that set AceDen apart. 
        </Typography>
      </m.div>

      <Box sx={{ position: 'relative' }}>
      {isDesktop ?
      <CarouselArrows filled onNext={handleNext} onPrevious={handlePrevious}>
          <Slider ref={carouselRef} {...settings}>
            {AceDenCards.map((item) => (
              <Box key={item.id} component={m.div} variants={varFade().in} sx={{ px: 1.5, mt: 5, mb: 7 }}>
              <FeatureCard item={item}  />
              </Box>
            ))}
          </Slider>
       </CarouselArrows>
       :
          <Slider ref={carouselRef} {...settings}>
            {AceDenCards.map((item) => (
              <Box key={item.id} component={m.div} variants={varFade().in} sx={{ px: 1.5, mt: 5, mb: 7 }}>
              <FeatureCard item={item}  />
              </Box>
            ))}
          </Slider>       
      }
      </Box>
    </Container>
  );
}

// ----------------------------------------------------------------------

function FeatureCard({item}) {

  return (
    <Card key={item.id} sx={{ p: 1, position: 'relative' }}>
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          content: "''",
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: ` radial-gradient(circle, transparent 25%, #ffffff 26%), linear-gradient(45deg, transparent 46%, #76b3ec 47%, #76b3ec 52%, transparent 53%), linear-gradient(135deg, transparent 46%, #76b3ec 47%, #76b3ec 52%, transparent 53%)`,
          backgroundSize: '1em 1em',
          backgroundColor: '#ffffff',
          opacity: 0.25,
          borderRadius: '1.5em', // Adjust the value to match your Image component
        },
      }}
    >
        <Image alt={item.name} src={item.image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
    </Box>
    <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
      {item.name}
    </Typography>
  </Card>
  );
}
