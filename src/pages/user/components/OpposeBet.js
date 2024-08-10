import React, { useState, useEffect } from 'react';
//mui
import { Box, Button, Divider, Grid, Typography, Dialog, DialogContent, Avatar, Tooltip, Link, DialogContentText } from '@mui/material';
//Components
import Iconify from '../../../components/Iconify';
import { useAccount } from 'wagmi';
//Redux
import { useDispatch } from 'react-redux';
import { joinBet } from "../../../redux/features/contractSlice";
//ABIS smart contract
import AceDenABIS from '../../../abis/AceDen.json';
//-----------------------Lottie
import Lottie from 'react-lottie';
import successAnimation from '../../../animations/success.json';
import loadingAnimation from '../../../animations/loading.json';
import ConfettiExplosion from 'react-confetti-explosion';


const OpposeBet = ({data}) => {


  //--------------------------------------------------------------

    // Lottie animation options for the different states
    const successAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: successAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    const loadingAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };


    const { address } = useAccount();
    const ethers = require("ethers");
    const dispatch = useDispatch();

    const [openMessage, setOpenMessage] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [message, setMessage] = useState(`Please, sign the transaction...`);
    const [transaction, setTransaction] = useState('');
    const [count, setCount] = useState(10);
    const [currentTime, setCurrentTime] = useState(new Date());

    //handle Preview
    const handleClickOpenPreview = () => {
      setOpenPreview(true);
    }

    const handleClickClosePreview = () => {
      setOpenPreview(false);
    }


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

    //-------------------------------------------------------------
  async function handleOpposeBet(e) {

    e.preventDefault();

    try {

    setOpenPreview(false);
    setOpenMessage(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, AceDenABIS, signer);
  
    const betAmount = data && data?.bet_amount;
    const betAmountInWei = ethers.utils.parseEther(betAmount.toString());
    const betId = data && data?.betId;

    setMessage('Please, sign the transaction...');
  
    const opposeBetOnChain = await contract.joinBet(betId, {value: betAmountInWei});

    setMessage('Opposing a bet on the blockchain...');
  
    const receipt = await opposeBetOnChain.wait();
  
    setMessage('Almost done...');
    await dispatch(joinBet({ id: data?._id }));
    setTransaction(receipt.transactionHash);
    setMessage('Bet opposed successfully!!');
  
    const intervalId = setInterval(() => {
      setCount((prevCountdown) => prevCountdown - 1);
    }, 1000);
  
    setTimeout(() => {
      clearInterval(intervalId);
      setOpenMessage(false);
      window.location.reload();
    }, count * 1000);

  } catch (error) {
    console.error("Error during opposing a bet:", error);
    setOpenMessage(false);
  }
  }


  return (
    <>


      <Dialog
        open={openMessage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { width: 330 } }} 
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            {message === 'Bet opposed successfully!!' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                  <ConfettiExplosion zIndex={1500} duration={4200} />
                </div>  
                <Lottie options={successAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Opposed successfully!! 🎉</Typography>
              </>
            ) :  (
              <>
                <Lottie options={loadingAnimationOptions} height={100} width={100} />
                <Typography variant="h6" sx={{mt: 1}}>Opposing (Do not close)</Typography>
              </>
            )}
          </Box>

          <DialogContentText id="alert-dialog-description">
            {message === 'Bet opposed successfully!!' ? `Pop-up will close in ${count} seconds` : message}
            {message === 'Bet opposed successfully!!' &&
            <>
            <br></br>
            <Link href={`https://sepolia.basescan.org/tx/${transaction}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold' }} > View Txn<Iconify icon={'majesticons:open'} sx={{verticalAlign: 'middle', ml: 0.5}}/></Link>
            </>
            }
          </DialogContentText>

        </DialogContent>
      </Dialog>

      <Dialog
        open={openPreview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleClickClosePreview}
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>

      <Typography variant='h5' sx={{ mb: 1, textAlign: 'center' }}>
        Oppose This Bet?
      </Typography>

      <Divider sx={{ width: '100%', mb: 2 }} />
         
      <Avatar sx={{ border: '0.5px dotted', borderColor: 'text.secondary', background: 'transparent', width: 56, height: 56, }} >
        <Iconify icon={data && data?.assetType === 'btc' ? 'cryptocurrency-color:btc' : data && data?.assetType === 'eth' ? 'cryptocurrency-color:eth' : data && data?.assetType === 'sol' ? 'cryptocurrency-color:sol' : null} width={40} height={40} />
      </Avatar>
      
      <Typography sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
            <Tooltip title="Creator" placement="left">
                <Link href={`https://sepolia.basescan.org/address/${data && data?.creator}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }} >
                    <>{`${data && data?.creator.substr(0, 4)}...${data && data?.creator.substr(-4)}`}</>{data && data?.creator === address && "(Me)"}
                </Link>
            </Tooltip> 
                &nbsp;bets that the price of <span style={{ fontWeight: 'bold' }}>{data && data?.assetType.toUpperCase()}</span> will be {data && data?.creatorPrediction === 'bullish' ? 'above' : 'below'}{' '}
                <span style={{ fontWeight: 'bold' }}>${data && data?.targetPrice}</span>
      </Typography>

      

      <Divider sx={{ width: '100%', mb: 2 }} />

      <Grid container sx={{ width: '100%', mb: 2 }}>
        <Grid item xs={6} sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle1" >
            Bet Amount
          </Typography>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, }} > <Iconify icon={'cryptocurrency-color:eth'} height={20} width={20} sx={{ mr: 0.5 }} /> {data && data?.bet_amount} ETH </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Settles In
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5, }}>{formatTimeUntil(data && data?.endTime)}  </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ width: '100%', mb: 2 }} />

      <Button onClick={handleOpposeBet} startIcon={<Iconify icon="streamline-emojis:thumbs-down-2" />} variant="contained" disabled={openMessage === true ? true : false}> 
        Yes, I oppose
      </Button>
          </Box>
        </DialogContent>
      </Dialog>



        <Button disabled={openPreview || openMessage} onClick={handleClickOpenPreview} startIcon={<Iconify icon="streamline-emojis:thumbs-down-2" />} variant="outlined" sx={{ mb: 2 }}>
            Oppose this Bet
        </Button>
    </>
  )
}

export default OpposeBet