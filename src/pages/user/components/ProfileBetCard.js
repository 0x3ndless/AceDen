import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Typography, Stack } from '@mui/material';

// components
import Image from '../../../components/Image';
// ----------------------------------------------------------------------


export default function ProfileBetCard({ data }) {

  return (
    <>
    <Card sx={{
      cursor: 'pointer',
      transition: "transform 0.15s ease-in-out",
      ':hover': {
        transform: "scale3d(1.02, 1.02, 1)"
      }}}>
    <RouterLink to={`/${ data && data.extension && data.extension.active && data.extension.total_claimed < Number(data && data.amount) ? 'claim' : 'nft' }/${ data && data.contractAddress && data.contractAddress[0].contractAddress }/${data && data.tokenID}`} color="inherit" style={{textDecoration: 'none', textTransform: 'capitalize'}}>
      <Box sx={{ position: 'relative', background: '#333d48' }}>
         
        <Image alt={data && data.name} src={data && data.image} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 2}}>
        
          <Typography variant="subtitle2" noWrap sx={{color: 'text.primary'}}>
            {data && data.name}
          </Typography>

      </Stack>
      </RouterLink>


    </Card>  

    </>
  );
}
