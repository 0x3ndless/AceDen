import { m } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Slider from 'react-slick';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Card, Container, Typography, Link, Divider, Grid, Tooltip, IconButton } from '@mui/material';
// components
import { MotionViewport } from '../../../components/animate';
import { CarouselArrows } from '../../../components/carousel';
import useResponsive from '../../../hooks/useResponsive';
import Iconify from '../../../components/Iconify';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getAllBets } from '../../../redux/features/contractSlice';
// ----------------------------------------------------------------------


export default function BetsSectionCard() {
  const carouselRef = useRef(null);
  const isDesktop = useResponsive('up', 'lg');

  const dispatch = useDispatch();
  const { allBets } = useSelector((state) => ({...state.app}));

  const theme = useTheme();

  const settings = {
    arrows: false,
    slidesToShow: 3,
    infinite: true,
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


  const fetchData = () => {
    dispatch(getAllBets());
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container component={MotionViewport} sx={{ pb: 10, textAlign: 'center' }}>

      <m.div>
        <Typography variant="h3" sx={{mb: 2}}>🎰 <span className="title_keyword2">Active Bets</span></Typography>
      </m.div>

      <m.div>
        <Typography sx={{ mx: 'auto', maxWidth: 630, color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'common.white'), }} >
        Explore the latest bets and counter with your own speculation!
        </Typography>
      </m.div>

      <Box sx={{ position: 'relative' }}>
      {isDesktop ?
      <CarouselArrows filled onNext={handleNext} onPrevious={handlePrevious}>
          <Slider ref={carouselRef} {...settings}>
            {allBets && allBets[0] && allBets[0].map((data) => (
              <Box key={data._id} component={m.div} sx={{ px: 1.5, mt: 5, mb: 7 }}>
                <FeatureCard data={data}  />
              </Box>
            ))
          }
          </Slider>
       </CarouselArrows>
       :
          <Slider ref={carouselRef} {...settings}>
            {allBets && allBets[0] && allBets[0].map((data) => (
              <Box key={data._id} component={m.div} sx={{ px: 1.5, mt: 5, mb: 7 }}>
                <FeatureCard data={data}  />
              </Box>
            ))
          }
          </Slider>       
      }
      </Box>

      {allBets && allBets[0] && allBets[0].length < 1 ?
      <Button component={RouterLink} to="/explore" variant='outlined' size='large' sx={{mt: 7}}>View All</Button>
      : 
      <Button component={RouterLink} to="/explore" variant='outlined' size='large' >View All</Button>
      }
    </Container>
  );
}

// ----------------------------------------------------------------------

function FeatureCard({data}) {

  const { address } = useAccount();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  function timeUntil(targetDateStr) {
    const now = currentTime;
    const targetDate = new Date(targetDateStr);
    const differenceInMillis = targetDate - now;

    if (differenceInMillis <= 0) {
      return { expired: true };
    }

    const totalMinutes = Math.floor(differenceInMillis / (1000 * 60));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return { expired: false, days, hours, minutes };
  }

  function formatTimeUntil(targetDateStr) {
    const { expired, days, hours, minutes } = timeUntil(targetDateStr);

    if (expired) {
      return 'Expired';
    }

    const dayStr = days > 0 ? `${days} ${days === 1 ? 'd' : 'ds'}` : '';
    const hourStr = hours > 0 ? `${hours} ${hours === 1 ? 'hr' : 'hrs'}` : '';
    const minuteStr = minutes > 0 ? `${minutes} ${minutes === 1 ? 'min' : 'mins'}` : '';
    const parts = [dayStr, hourStr, minuteStr].filter(part => part !== '').join(' & ');

    return parts || 'less than a minute';
  }


  return (
    <Card
      key={data?._id}
      sx={{
        boxShadow: 3,
        p: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

        <Tooltip title={<span style={{ textTransform: 'capitalize' }}>{data?.creatorPrediction}</span>} placement="right">
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton
              sx={{
                pointerEvents: 'none',
                color: 'text.secondary',
              }}
            >
              <Iconify icon={data?.creatorPrediction === 'bullish' ? "flat-color-icons:bullish" : data?.creatorPrediction === 'bearish' ? "flat-color-icons:bearish" : null} width={20} height={20} />
            </IconButton>
          </div>
        </Tooltip>

        <Avatar
          sx={{
            border: '0.5px dotted',
            borderColor: 'text.secondary',
            background: 'transparent',
            width: 56,
            height: 56,
          }}
        >
          <Iconify icon={data?.assetType === 'btc' ? 'cryptocurrency-color:btc' : data?.assetType === 'eth' ? 'cryptocurrency-color:eth' : data?.assetType === 'sol' ? 'cryptocurrency-color:sol' : null} width={40} height={40} />
        </Avatar>
    
      <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'center' }}>
      <Tooltip title="Creator" placement="right">
        <Link
          href={`https://base-sepolia.blockscout.com/address/${data?.creator}`}
          target="_blank"
          rel="noopener"
          style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }}
        >
          <>{`${data?.creator.substr(0, 4)}...${data?.creator.substr(-4)}`}</> <Iconify icon={'majesticons:open'} sx={{ verticalAlign: 'middle', ml: 0 }} />
        </Link>
        </Tooltip>
      </Typography>
      
      <Typography sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
        I bet that the price of <span style={{ fontWeight: 'bold' }}>{data?.assetType}</span> will be {data?.creatorPrediction === 'bullish' ? 'above' : 'below'}{' '}
        <span style={{ fontWeight: 'bold' }}>${data?.targetPrice}</span> in the next <span style={{ fontWeight: 'bold' }}>{formatTimeUntil(data?.endTime)}</span>
      </Typography>

      <Divider sx={{ width: '100%', mb: 2 }} />

      <Grid container sx={{ width: '100%', mb: 2 }}>
        <Grid item xs={6} sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle1" >
            Bet Amount
          </Typography>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, }} > <Iconify icon={'cryptocurrency-color:eth'} height={16} width={16} sx={{ mr: 0.5 }} /> {data?.bet_amount} ETH </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Join Until
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 0.5, }}>{data && data?.opponent !== null ? '🔒' : formatTimeUntil(data?.joinUntil)}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ width: '100%', mb: 2 }} />

        {data?.creator  === address && data?.opponent === null ? 
          <Button component={RouterLink} to={`/bet/${data?._id}`} variant="outlined" sx={{ mb: 2 }}>
            Bet Details
          </Button>
          : data?.opponent !== null ?
          <Button component={RouterLink} to={`/bet/${data?._id}`} startIcon={<Iconify icon="majesticons:open-line" />} variant="outlined" sx={{ mb: 2 }}>
            Opposed
          </Button>
          :
          <Button component={RouterLink} to={`/bet/${data?._id}`} startIcon={<Iconify icon="streamline-emojis:thumbs-down-2" />} variant="outlined" sx={{ mb: 2 }}>
            Oppose this Bet
          </Button>
        }
    </Card>
  );
}
