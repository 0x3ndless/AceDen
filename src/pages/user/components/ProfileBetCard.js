import React, { useState, useEffect } from 'react';
import Iconify from '../../../components/Iconify';
// @mui
import { Card, Typography, Tooltip, IconButton, Avatar, Divider, Grid, Button } from '@mui/material';
// ----------------------------------------------------------------------

export default function ProfileBetCard({ data }) {
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

    const dayStr = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
    const hourStr = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
    const minuteStr = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';
    const parts = [dayStr, hourStr, minuteStr].filter(part => part !== '').join(' & ');

    return parts || 'less than a minute';
  }

  return (
    <>
      <Card
        key={1}
        sx={{
          boxShadow: 3,
          p: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '300px', // Set a fixed width for layout consistency
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

        <Typography sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
          I bet that the price of <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{data?.assetType}</span> will be above{' '}
          <span style={{ fontWeight: 'bold' }}>${data?.targetPrice}</span> in the next <span style={{ fontWeight: 'bold' }}>{formatTimeUntil(data?.endTime)}</span>
        </Typography>

        <Divider sx={{ width: '100%', mb: 2 }} />

        <Grid container sx={{ width: '100%', mb: 2 }}>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography variant="subtitle1">
              Bet Amount
            </Typography>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, }}>
              <Iconify icon={'cryptocurrency-color:eth'} height={16} width={16} sx={{ mr: 0.5 }} /> {data?.bet_amount} ETH
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Join Until
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 0.5, }}>{formatTimeUntil(data?.joinUntil)}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ width: '100%', mb: 2 }} />

        <Button variant="outlined" color='error' sx={{ mb: 2 }}>
          Cancel Bet
        </Button>
      </Card>
    </>
  );
}
