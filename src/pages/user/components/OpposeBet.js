import React from 'react';
//mui
import { Button } from '@mui/material';
//Components
import Iconify from '../../../components/Iconify';


const OpposeBet = ({data}) => {

    console.log(data)

  return (
    <>
        <Button startIcon={<Iconify icon="streamline-emojis:thumbs-down-2" />} variant="outlined" sx={{ mb: 2 }}>
            Oppose this Bet
        </Button>
    </>
  )
}

export default OpposeBet