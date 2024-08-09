import React from 'react';
import Iconify from '../../../components/Iconify';
// @mui
import { Card, Typography, Tooltip, IconButton, Avatar, Divider, Grid, Button } from '@mui/material';
// ----------------------------------------------------------------------


export default function ProfileBetCard({ data }) {

  function timeRemaining(currentDate, endTimeInSeconds) {
    const currentDateTime = new Date(currentDate);
    const endDateTime = new Date(endTimeInSeconds * 1000);
  
    // Calculate the difference in milliseconds
    const diffInMs = endDateTime - currentDateTime;
  
    if (diffInMs <= 0) {
      return "The time has passed";
    }
  
    // Convert milliseconds to seconds
    const diffInSeconds = Math.floor(diffInMs / 1000);
  
    // Calculate days, hours, and minutes
    const days = Math.floor(diffInSeconds / (24 * 3600));
    const hours = Math.floor((diffInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
  
    // Format the result
    let result = '';
    if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `;
    if (hours > 0 || days > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `;
    result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
  
    return result.trim();
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

       <Tooltip title={<span style={{textTransform: 'capitalize'}}>{data?.creatorPrediction}</span>} placement="right">
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
        <span style={{ fontWeight: 'bold' }}>${data?.targetPrice}</span> in the next <span style={{ fontWeight: 'bold' }}>{timeRemaining(data?.date, data?.endTime)}</span>
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
          <Typography variant="subtitle2" sx={{ mt: 0.5, }}>{timeRemaining(data?.date, data?.joinUntill)}</Typography>
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
